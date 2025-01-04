import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import UserModal from "./UserModal";

type NavbarProps = {
  userData?: { name: string };
};

const NavBar = ({ userData }: NavbarProps) => {
  const defaultAvatar = useRef(
    "https://m.media-amazon.com/images/G/02/CerberusPrimeVideo-FN38FSBD/adult-3.png"
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any existing timer
    }
    setIsDropdownOpen(true); // Open dropdown
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false); // Close dropdown after delay
    }, 300); // Adjust the delay time as needed
  };

  // Close dropdown when userData changes (e.g., user logs out)
  useEffect(() => {
    if (!userData) {
      setIsDropdownOpen(false);
    }
  }, [userData]);

  // Clean up timeoutRef on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="h-16 bg-[#FFFDFC]  fixed top-0 w-full text-green-900 flex items-center justify-between px-[6%] border-b-2 border-gray-200 z-40 ">
      <div className="flex space-x-12">
        <div className="icon">
          <h1
            className="text-3xl font-bold tracking-wider text-[#201f1e] cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span>Zip</span>
            <span className=" text-[#245e5a] font-helvetica">Link</span>
          </h1>
        </div>
      </div>
      {userData ? (
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`rounded-full p-1 cursor-pointer ${
              isDropdownOpen && "bg-white"
            } transform duration-200 ease-in-out`}
          >
            <img
              src={defaultAvatar.current}
              alt="profile picture"
              className="w-11 h-11 rounded-full"
            />
          </div>
          {isDropdownOpen && <UserModal name={userData.name} />}
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          {["/login", "/signup"].map((authPath, index) => (
            <NavLink
              key={index}
              to={authPath}
              className={({ isActive }) =>
                `text-lg py-1 px-2 rounded cursor-pointer text-center md:font-medium hover:bg-[#245e5a]   hover:text-[#EEEFF1] ${
                  isActive && "bg-[#245e5a] text-[#EEEFF1] "
                }`
              }
            >
              {authPath === "/login" ? "Login" : "Signup"}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
