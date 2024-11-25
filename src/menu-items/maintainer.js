// assets
import { IconDashboard, IconList, IconEdit } from '@tabler/icons-react';

// constant
const icons = { IconDashboard, IconEdit, IconList };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const maintainScreen = {
  id: 'maintain',
  title: 'Bảo trì',
  type: 'group',
  children: [
    {
      id: 'maintain-list',
      title: 'Thông tin có thay đổi',
      type: 'item',
      url: '/maintain',
      icon: icons.IconList,
      breadcrumbs: true
    },
    {
      id: 'room',
      title: 'Danh sách phòng',
      type: 'item',
      url: '/room',
      icon: icons.IconList,
      breadcrumbs: true
    }
  ],
  role: ['admin', 'TK', 'PK', 'MT']
};

export default maintainScreen;
