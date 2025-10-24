import React from 'react';
import { Avatar, Menu, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ user, logout }) => {
  const navigate = useNavigate();
  return (
    <Menu
      position="bottom-end"
      offset={8}
      shadow="lg"
      radius="xl"
      classNames={{
        dropdown:
          'rounded-2xl p-5 border border-gray-100 shadow-xl min-w-[160px] text-center',
        label: 'text-gray-500 font-semibold text-center',
        item: 'font-semibold rounded-lg text-center flex justify-center hover:bg-[#D4E7FE] focus:bg-[#D4E7FE]',
      }}>
      <Menu.Target>
        <Avatar
          src={user?.picture}
          alt="user image"
          radius="xl"
          className="cursor-pointer ring-1 ring-black/5"
        />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item onClick={() => navigate('./favourites', { replace: true })}>
          Favourites
        </Menu.Item>
        <Menu.Item onClick={() => navigate('./bookings', { replace: true })}>
          Bookings
        </Menu.Item>
        <Menu.Label>Go back</Menu.Label>
        {/* <Menu.Item
          onClick={() => {
            localStorage.clear();
            logout();
          }}
          color="red">
          Logout
        </Menu.Item> */}
        <div className="mt-3">
          <Button
            fullWidth
            radius="xl"
            color="blue"
            className="font-semibold"
            onClick={() => {
              localStorage.clear();
              logout();
            }}>
            Logout
          </Button>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
