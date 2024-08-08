import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import NoPermissionPage from 'views/pages/NoPermissionPage';

const onlyAdmin = (WrappedComponent) => {
  return (props) => {
    const user = useSelector((state) => {
      return state.customization.user;
    });

    return user.role === 'TK' || user.role === 'PK' ? <WrappedComponent {...props} /> : <NoPermissionPage />;
  };
};

export default onlyAdmin;
