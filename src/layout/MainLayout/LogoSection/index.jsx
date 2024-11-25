import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';

// project imports
import config from 'config';
import Logo from 'ui-component/Logo';
import { MENU_OPEN } from 'store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const user = useSelector((state) => state.customization.user);
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase
      disableRipple
      onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
      component={Link}
      to={user.role !== 'MT' ? config.defaultPath : config.secondPath}
    >
      <strong style={{ textAlign: 'center' }}>
        Cao đẳng <br />
        Kỹ thuật Cao Thắng
      </strong>
    </ButtonBase>
  );
};

export default LogoSection;
