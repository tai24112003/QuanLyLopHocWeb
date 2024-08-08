import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { runGetUser } from 'api/auth';
import { SET_USER } from 'store/actions';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
      runGetUser()
        .then((data) => {
          if (data.status === 'success') {
            dispatch({
              type: SET_USER,
              user: {
                id: data.data[0].id,
                name: data.data[0].name,
                email: data.data[0].email,
                phone: data.data[0].phone,
                role: data.data[0].role
              }
            });
          } else {
            throw new Error('Get user failed');
          }
        })
        .catch((e) => {
          window.location.href = '/login';
        });
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
