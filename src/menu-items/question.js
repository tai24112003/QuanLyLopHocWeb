// assets
import { IconDashboard, IconList } from '@tabler/icons-react';

// constant
const icons = { IconDashboard, IconList };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const questionScreen = {
  id: 'question',
  title: 'Câu hỏi',
  type: 'group',
  children: [
    {
      id: 'question',
      title: 'Danh sách',
      type: 'item',
      url: '/question',
      icon: icons.IconList,
      breadcrumbs: true
    }
  ],
  role: ['admin', 'gv']
};

export default questionScreen;
