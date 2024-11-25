import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import NoPermissionPage from 'views/pages/NoPermissionPage';

const onlyMaintain = (WrappedComponent) => {
  return (props) => {
    const user = useSelector((state) => {
      return state.customization.user;
    });

    return user.role === 'TK' || user.role === 'PK' || user.role === 'MT' ? <WrappedComponent {...props} /> : <NoPermissionPage />;
  };
};

export default onlyMaintain;
