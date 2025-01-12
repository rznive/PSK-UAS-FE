import React from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { useSelector } from 'react-redux';

function Header({ onToggleSidebar }) {
  const token = useSelector((state) => state.auth.token);
  const loggedInUserName = token ? JSON.parse(atob(token.split('.')[1])).nama : null;

  return (
    <header className="bg-blue-900 text-white flex justify-between items-center px-6 h-16 w-full rounded-sm absolute top-0 left-0 z-20">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="text-white text-2xl mr-4 focus:outline-none"
        >
          <AiOutlineMenu />
        </button>
        <h1 className="text-lg font-semibold">News | Merapi</h1>
      </div>
      <span className="flex items-center">
        <span>{loggedInUserName ? loggedInUserName : 'Guest'}</span>
        {/* <span>Guest</span> */}

        <div className="ml-3 w-8 h-8 bg-blue-400 rounded-full"></div>
      </span>
    </header>
  );
}

export default Header;
