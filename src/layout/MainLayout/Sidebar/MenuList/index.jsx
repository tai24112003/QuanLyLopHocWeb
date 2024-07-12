// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useSelector } from 'react-redux';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const user = useSelector((state) => {
    return state.customization.user;
  });

  const navItems = menuItem.items
    .filter((item) => {
      return item?.role?.includes(user.role) ?? false;
    })
    .map((item) => {
      switch (item.type) {
        case 'group':
          return <NavGroup key={item.id} item={item} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    });

  return <>{navItems}</>;
};

export default MenuList;
