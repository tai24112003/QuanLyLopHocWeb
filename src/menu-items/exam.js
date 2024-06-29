// assets
import { IconDashboard,IconList,IconEdit } from '@tabler/icons-react';

// constant
const icons = { IconDashboard,IconEdit,IconList };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const examScreen = {
  id: 'exam',
  title: 'Đề thi',
  type: 'group',
  children: [
    {
      id: 'exam-list',
      title: 'Danh sách',
      type: 'item',
      url: '/exam',
      icon: icons.IconList,
      breadcrumbs: true
    },
    {
        id: 'create-exam',
        title: 'Tạo đề thi',
        type: 'item',
        url: '/exam/create',
        icon: icons.IconEdit,
        breadcrumbs: true
      }
  ]
};

export default examScreen;
