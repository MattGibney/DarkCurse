import { Request, Response } from 'express';
import { marked } from 'marked';
import { PageAlert } from '../../../types/typings';
import { MessageData } from '../../daos/user';

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
  const newMessage: MessageData = {
    id: message.id,
    subject: message.subject,
    body: marked.parse(message.body),
    from_user: message.from_user,
    to_user: message.to_user,
    date_time: message.date_time,
  };
  return res.render('page/main/inbox/readmessage', {
    layout: 'main',
    pageTitle: 'Compose',
    sidebarData: req.sidebarData,
    menu_category: 'home',
    menu_link: 'Inbox',
    userDataFiltered: await req.user.formatUsersStats(req.user),

    message: newMessage,
    ActionMessage: 'Compose New',
  });
}
async function replyPage(req: Request, res: Response, alert?: PageAlert) {
  const message = await req.daoFactory?.user.fetchMessageById(
    parseInt(req.params.msgId)
  );
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
  const reply: MessageData = {
    id: message.id,
    subject: message.subject,
    body:
      'Type your response here\n\n\n\n-----\n' +
      '-----\n' +
      '\nFrom: ' +
      message.from_user.displayName +
      '\nTo: ' +
      message.to_user.displayName +
      '\nSubject: ' +
      message.subject +
      '\nDate: ' +
      message.date_time.toString() +
      '\n\n-----\n' +
      message.body,
    from_user: message.from_user,
    to_user: message.to_user,
    date_time: message.date_time,
  };
  return res.render('page/main/inbox/compose', {
    layout: 'main',
    pageTitle: 'Compose',
    sidebarData: req.sidebarData,
    menu_category: 'home',
    menu_link: 'Inbox',
    userDataFiltered: await req.user.formatUsersStats(req.user),

    message: reply,
    action: 'reply',
    ActionMessage: 'Reply',
  });
}
export default { inboxPage, composePage, readPage, replyPage };
