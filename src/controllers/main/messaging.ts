import { Request, Response } from 'express';
import { PageAlert } from '../../../types/typings';

async function inboxPage(req: Request, res: Response, alert?: PageAlert) {
  const messages = [
    {
      is_unread: false,
      id: 1,
      subject: 'Test',
      body: 'Test',
      date: '2020-01-01',
      displayName: 'Test',
    },
    {
      is_unread: false,
      id: 2,
      subject: 'Test',
      body: 'Test',
      date: '2020-01-01',
      displayName: 'Test',
    },
    {
      is_unread: true,
      id: 3,
      subject: 'Test',
      body: 'Test',
      date: '2020-01-01',
      displayName: 'Test',
    },
  ];
  return res.render('page/main/inbox/inbox', {
    layout: 'main',
    pageTitle: 'Inbox',
    sidebarData: req.sidebarData,
    menu_category: 'home',
    menu_link: 'Inbox',
    userDataFiltered: await req.user.formatUsersStats(req.user),

    messages: messages,
  });
}
export default { inboxPage };
