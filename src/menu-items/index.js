import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import questionScreen from './question';
import examScreen from './exam';
import subjectScreen from './subject';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, questionScreen, examScreen, subjectScreen, pages]
};

export default menuItems;
