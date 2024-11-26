// assets
import { IconDashboard, IconList, IconEdit } from '@tabler/icons-react';

// constant
const icons = { IconDashboard, IconEdit, IconList };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const studentScreen = {
  id: 'student',
  title: 'Sinh viên',
  type: 'group',
  children: [
    {
      id: 'student-list',
      title: 'Chuyên cần',
      type: 'item',
      url: '/student',
      icon: icons.IconList
    }
  ],
  role: ['admin', 'TK', 'PK', 'GV', 'MT']
};

export default studentScreen;
