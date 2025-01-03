import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdCreate, IoMdHome } from "react-icons/io";
import { SiGoogleanalytics } from "react-icons/si";
import { IoSettings } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";

import {
  TbLayoutSidebarRightExpandFilled,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);

  const toggleSidebar = () => {
    if (!isOpen) {
      // Sidebar opening
      setIsOpen(true);
      setTimeout(() => {
        setIsTextVisible(true);
      }, 250); // Delay text visibility by 300ms
    } else {
      // Sidebar closing
      setIsTextVisible(false);

      setTimeout(() => {
        setIsOpen(false);
      }, 100); // Match sidebar closing animation duration
    }
  };

  return (
    <div
      className={`h-screen  text-[#676b75] fixed px-2 left-0 z-50 border-r-[1px] text-nowrap border-gray-200 ${
        isOpen ? "w-64" : "w-16"
      } transition-width duration-300 overflow-hidden`}
    >
      {/* Toggle Button */}
      <div className="flex items-center space-x-4 py-3 px-1">
        <button
          onClick={toggleSidebar}
          className="text-[#004400] hover:bg-[#EEEFF1] p-2 rounded-md"
        >
          {isOpen ? (
            <TbLayoutSidebarRightExpandFilled size={24} />
          ) : (
            <TbLayoutSidebarLeftExpandFilled size={24} />
          )}
        </button>
        {isOpen && (
          <span
            className={`text-xl font-semibold text-[#004400] transition-opacity duration-300 ${
              isTextVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Menu
          </span>
        )}
      </div>

      <ul className="mt-6 space-y-4">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-[11px] py-3 font-semibold hover:bg-[#EEEFF1] rounded-md cursor-pointer
              ${isActive ? "bg-[#EEEFF1] text-[#004400]" : "text-[#676b75]"}`
            }
          >
            <IoMdHome size={24} />
            <span
              className={`transition-opacity duration-300 ${
                isTextVisible ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              Home
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/create-course"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-[11px] py-3 font-semibold hover:bg-[#EEEFF1] rounded-md cursor-pointer
              ${isActive ? "bg-[#EEEFF1] text-[#004400]" : "text-[#676b75]"}`
            }
          >
            <IoMdCreate size={24} />
            <span
              className={`transition-opacity duration-300 ${
                isTextVisible ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              Create Course
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/account-setting"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-[11px] py-3 font-semibold hover:bg-[#EEEFF1] rounded-md cursor-pointer
              ${isActive ? "bg-[#EEEFF1] text-[#004400]" : "text-[#676b75]"}`
            }
          >
            <IoSettings size={24} />
            <span
              className={`transition-opacity duration-300 ${
                isTextVisible ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              Account & Settings
            </span>
          </NavLink>
        </li>

        {/* Watch History (Static) */}
        <li>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center space-x-4 px-[11px] py-3 font-semibold hover:bg-[#EEEFF1] rounded-md cursor-pointer
              ${isActive ? "bg-[#EEEFF1] text-[#0e312a]" : "text-[#676b75]"}`
            }
          >
            <SiGoogleanalytics size={24} />

            <span
              className={`transition-opacity duration-300 ${
                isTextVisible ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              Analytics
            </span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;