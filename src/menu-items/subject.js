// assets
import { IconDashboard, IconList, IconEdit } from '@tabler/icons-react';

// constant
const icons = { IconDashboard, IconEdit, IconList };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const subjectScreen = {
  id: 'subject',
  title: 'Chủ đề & Chương',
  type: 'group',
  children: [
    {
      id: 'subject-list',
      title: 'Danh sách',
      type: 'item',
      url: '/subject',
      icon: icons.IconList,
      breadcrumbs: true
    }
  ],
  role: ['admin', 'GV', 'TK', 'PK']
};

export default subjectScreen;
