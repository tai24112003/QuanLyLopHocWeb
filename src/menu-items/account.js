// assets
import { IconDashboard, IconList, IconEdit } from '@tabler/icons-react';

// constant
const icons = { IconDashboard, IconEdit, IconList };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const accountScreen = {
  id: 'account',
  title: 'Giáo viên',
  type: 'group',
  children: [
    {
      id: 'account-list',
      title: 'Danh sách',
      type: 'item',
      url: '/account',
      icon: icons.IconList,
      breadcrumbs: true
    }
  ],
  role: ['admin', 'TK', 'PK']
};

export default accountScreen;
