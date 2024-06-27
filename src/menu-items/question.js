// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

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
      icon: icons.IconDashboard,
      breadcrumbs: true
    }
  ]
};

export default questionScreen;
