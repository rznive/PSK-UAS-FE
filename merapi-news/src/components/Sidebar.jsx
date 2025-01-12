import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineHome, AiOutlineBook, AiOutlineLogout } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/AuthSlice';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmLogout) {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="w-48 bg-blue-100 h-screen flex flex-col z-10">
      <ul className="space-y-4 mt-20">
        <li className="pl-4">
          <Link to="/" className="flex items-center text-black">
            <AiOutlineHome className="mr-1 text-md" />
            <span>Home</span>
          </Link>
        </li>
        <li className="pl-4">
          <Link to="/newsPage" className="flex items-center text-black">
            <AiOutlineBook className="mr-1 text-md" />
            <span>News Report</span>
          </Link>
        </li>
        <hr className="border-gray-300 my-2 mx-4" />
        <li className="pl-4">
          <button
            onClick={handleLogout}
            className="flex items-center text-black focus:outline-none"
          >
            <AiOutlineLogout className="mr-1 text-md" />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
