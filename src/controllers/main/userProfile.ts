import { Request, Response } from 'express';
import { PlayerUnit, PageAlert } from '../../../types/typings';
import { Fortifications } from '../../constants';
import { marked } from 'marked';

export default {
  async renderUserProfile(req: Request, res: Response) {
    const userProfileId = Number(req.params.userId);

    const userProfile = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      userProfileId
    );

    const userProfileRank = await userProfile.fetchRank(userProfile.id);
    let cantAttack = true;
    if (req.user?.id !== undefined) {
      if (userProfileId == req.user?.id) return res.redirect('/overview');
      if (
        userProfile.level >= req.user.level - 5 &&
        userProfile.level <= req.user.level + 5 &&
        req.user.offense != 0
      ) {
        cantAttack = false;
      }

      let messages: PageAlert;
      if (req.query.err) {
        const err = req.query.err;
        switch (err) {
          case 'TooHigh':
            messages = {
              type: 'DANGER',
              message: 'That player is too high for you to attack!',
            };
            break;
          case 'TooLow':
            messages = {
              type: 'DANGER',
              message: 'That player is too low for you to attack!',
            };
            break;
          case 'OwnLink':
            messages = {
              type: 'DANGER',
              message: 'You can not recruit yourself!',
            };
            break;
          case 'Recruited':
            messages = {
              type: 'SUCCESS',
              message: `You've recruited ${userProfile.displayName}!`,
            };
            break;
          default:
            messages = {
              type: 'DANGER',
              message: 'You need to train soldiers to be able to attack!!',
            };
            break;
        }
      }
      marked.setOptions({
        renderer: new marked.Renderer(),
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartypants: false,
        xhtml: false,
      });
      const renderer = {
        table(header: string, body: string) {
          return `
            <table class="table table-striped table-dark">
            ${body}
            </table>      
          `;
        },
      };
      marked.use({ renderer });
      const bio = userProfile.bio === null ? '' : userProfile.bio;
      return res.render('page/main/userProfile', {
        layout: 'main',
        pageTitle: `Profile ${userProfile.displayName}`,
        sidebarData: req.sidebarData,
        id: userProfile.id,
        displayName: userProfile.displayName,
        userDataFiltered: await req.user.formatUsersStats(req.user),
        race: userProfile.race,
        class: userProfile.class,
        level: userProfile.level,
        overallRank: userProfileRank,
        population: userProfile.population,
        armySize: userProfile.armySize,
        fortification: Fortifications[userProfile.fortLevel].name,
        gold: new Intl.NumberFormat('en-GB').format(userProfile.gold),
        recruitLink: await userProfile.userRecruitingLink(),
        bio: marked.parse(bio),
        cantAttack: cantAttack,
        messages: messages,
        isOnline:
          userProfile.last_active < new Date(new Date().getTime() - 300000)
            ? false
            : true,
        isPlayer: userProfileId == req.user.id ? true : false,
      });
    } else {
      return res.render('page/main/userProfile', {
        layout: 'main',
        pageTitle: `Profile ${userProfile.displayName}`,
        hideSidebar: true,
        sidebarData: req.sidebarData,
        id: userProfile.id,
        displayName: userProfile.displayName,
        userDataFiltered: await userProfile.formatUsersStats(userProfile),
        race: userProfile.race,
        class: userProfile.class,
        level: userProfile.level,
        overallRank: userProfileRank,
        population: userProfile.population,
        armySize: userProfile.armySize,
        recruitLink: await userProfile.userRecruitingLink(),
        fortification: Fortifications[userProfile.fortLevel].name,
        gold: new Intl.NumberFormat('en-GB').format(userProfile.gold),
        bio: 'THIS IS A BIO',
        cantAttack: cantAttack,
        isOnline:
          userProfile.last_active < new Date(new Date().getTime() - 300000)
            ? false
            : true,
        isPlayer: false,
      });
    }
  },

  async handleRecruitment(req: Request, res: Response) {
    const recruitmentCode = req.params.id;
    if (req.user?.id !== undefined) {
      const mylink = await req.user.userRecruitingLink();
      if (recruitmentCode == mylink)
        return res.redirect('/overview?err=ownLink');
    }
    console.log(recruitmentCode);
    const recruitedPlayerID = await req.daoFactory.user.fetchIDByRecruitingLink(
      recruitmentCode
    );
    const recruitedPlayer = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      recruitedPlayerID
    );
    const recruitedHistory =
      await req.modelFactory.recruitHistory.fetchCountClicksToID(
        req.modelFactory,
        req.daoFactory,
        req.logger,
        recruitedPlayerID
      );
    if (recruitedHistory == 25) {
      return res.send('User is over their daily limit');
    }
    const myIP =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress;

    const myClicks = await req.modelFactory.recruitHistory.fetchCountClicksByIP(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      myIP.toString()
    );
    if (myClicks == 250) {
      return res.send('You have recruited too many players today');
    }
    const clicksToUser =
      await req.modelFactory.recruitHistory.fetchCountClicksByIPtoID(
        req.modelFactory,
        req.daoFactory,
        req.logger,
        myIP.toString(),
        recruitedPlayerID
      );
    if (clicksToUser)
      return res.send('You have already recruited this player today');
    const newCitizen: PlayerUnit = {
      level: 1,
      type: 'CITIZEN',
      quantity: 1,
    };
    await recruitedPlayer.trainNewUnits([newCitizen], false);
    await req.modelFactory.recruitHistory.createHistory(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      {
        to_user: recruitedPlayerID,
        from_user: req.user?.id || 0,
        ip_addr: myIP.toString(),
      }
    );
    return res.redirect(`/userprofile/${recruitedPlayerID}?err=Recruited`);
  },

  async renderRecruitPage(req: Request, res: Response) {
    const recruitmentCode = req.params.id;
    if (req.user?.id !== undefined) {
      const mylink = await req.user.userRecruitingLink();
      if (recruitmentCode == mylink)
        return res.redirect('/overview?err=ownLink');
    }
    const recruitedPlayerID = await req.daoFactory.user.fetchIDByRecruitingLink(
      recruitmentCode
    );
    const recruitedPlayer = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      recruitedPlayerID
    );
    const recruitedHistory =
      await req.modelFactory.recruitHistory.fetchCountClicksToID(
        req.modelFactory,
        req.daoFactory,
        req.logger,
        recruitedPlayerID
      );
    if (recruitedHistory == 25) {
      return res.send('User is over their daily limit');
    }
    const myIP =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress;

    const myClicks = await req.modelFactory.recruitHistory.fetchCountClicksByIP(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      myIP.toString()
    );
    if (myClicks == 250) {
      return res.send('You have recruited too many players today');
    }

    const clicksToUser =
      await req.modelFactory.recruitHistory.fetchCountClicksByIPtoID(
        req.modelFactory,
        req.daoFactory,
        req.logger,
        myIP.toString(),
        recruitedPlayerID
      );
    if (clicksToUser)
      return res.send('You have already recruited this player today');

    if (req.user?.id !== undefined) {
      return res.render('page/main/recruitPage', {
        layout: 'main',
        pageTitle: `Profile ${recruitedPlayer.displayName}`,
        sidebarData: req.sidebarData,
        id: recruitedPlayer.id,
        displayName: recruitedPlayer.displayName,
        userDataFiltered: await req.user.formatUsersStats(req.user),
        recruitLink: await recruitedPlayer.userRecruitingLink(),
      });
    } else {
      return res.render('page/main/recruitPage', {
        layout: 'marketing',
        pageTitle: `Profile ${recruitedPlayer.displayName}`,
        id: recruitedPlayer.id,
        displayName: recruitedPlayer.displayName,
        recruitLink: await recruitedPlayer.userRecruitingLink(),
        hideSidebar: true,
      });
    }
  },
};
