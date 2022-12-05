import { Request, Response } from 'express';
import { PageAlert } from '../../../types/typings';

async function inboxPage(req: Request, res: Response, alert?: PageAlert) {
  const messagesDb = await req.daoFactory?.user.fetchMessages(req.user.id);
  return res.render('page/main/inbox/inbox', {
    layout: 'main',
    pageTitle: 'Inbox',
    sidebarData: req.sidebarData,
    menu_category: 'home',
    menu_link: 'Inbox',
    userDataFiltered: await req.user.formatUsersStats(req.user),

    messages: messagesDb,
  });
}

async function composePage(req: Request, res: Response, alert?: PageAlert) {
  let msgId = 0;
  if (req.params.msgId) {
    msgId = parseInt(req.params.msgId);
  }
  let oldMsg = null;
  /*if(msgId > 0){

  }*/

  return res.render('page/main/inbox/compose', {
    layout: 'main',
    pageTitle: 'Compose',
    sidebarData: req.sidebarData,
    menu_category: 'home',
    menu_link: 'Inbox',
    userDataFiltered: await req.user.formatUsersStats(req.user),

    ActionMessage: 'Compose New',
  });
}

async function readPage(req: Request, res: Response, alert?: PageAlert) {
  const message = await req.daoFactory?.user.fetchMessageById(
    parseInt(req.params.msgId)
  );
  return res.render('page/main/inbox/readmessage', {
    layout: 'main',
    pageTitle: 'Compose',
    sidebarData: req.sidebarData,
    menu_category: 'home',
    menu_link: 'Inbox',
    userDataFiltered: await req.user.formatUsersStats(req.user),

    message: message,
    ActionMessage: 'Compose New',
  });
}
export default { inboxPage, composePage, readPage };
