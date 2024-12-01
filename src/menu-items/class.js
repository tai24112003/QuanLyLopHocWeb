// assets
import { IconDashboard, IconList, IconEdit } from '@tabler/icons-react';

// constant
const icons = { IconDashboard, IconEdit, IconList };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const classScreen = {
  id: 'room',
  title: 'Lớp',
  type: 'group',
  children: [
    {
      id: 'room-list',
      title: 'Danh sách',
      type: 'item',
      url: '/class',
      icon: icons.IconList,
      breadcrumbs: true
    }
  ],
  role: ['admin', 'TK', 'PK', 'GV']
};

export default classScreen;
