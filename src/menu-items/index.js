import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import questionScreen from './question';
import examScreen from './exam';
import subjectScreen from './subject';
import accountScreen from './account';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, questionScreen, examScreen, accountScreen, subjectScreen]
};

export default menuItems;
