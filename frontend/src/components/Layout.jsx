import React, { useContext, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import UserDetailContext from '../context/userDetailContext';
import { useMutation } from 'react-query';
import { createUser } from '../utils/api';
import useFavourites from '../hooks/useFavourites.jsx';
import useBookings from '../hooks/useBookings.jsx';

const audience = import.meta.env.VITE_AUDIENCE;

const Layout = () => {
  useFavourites();
  useBookings();

  const { isAuthenticated, user, getAccessTokenWithPopup } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  const { mutate } = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token),
  });

  useEffect(() => {
    const getTokenAndRegister = async () => {
      const res = await getAccessTokenWithPopup({
        authorizationParams: {
          audience: audience,
          scope: 'openid profile email',
        },
      });
      localStorage.setItem('access_token', res);
      setUserDetails((prev) => ({ ...prev, token: res }));
      mutate(res);
    };

    isAuthenticated && getTokenAndRegister();
  }, [getAccessTokenWithPopup, isAuthenticated, mutate, setUserDetails]);

  return (
    <>
      <div>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
