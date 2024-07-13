import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import questionScreen from './question';
import examScreen from './exam';
import subjectScreen from './subject';
import accountScreen from './account';
import roomScreen from './room';
import studentScreen from './student';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, questionScreen, examScreen, accountScreen, subjectScreen, studentScreen, roomScreen]
};

export default menuItems;
