import dashboard from './dashboard';
import accountScreen from './account';
import roomScreen from './room';
import studentScreen from './student';
import maintainScreen from './maintainer';
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, studentScreen, accountScreen, maintainScreen]
  // items: [dashboard, questionScreen, examScreen, accountScreen, subjectScreen, studentScreen, roomScreen]
};

export default menuItems;
