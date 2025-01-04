import { MdOutlineLogout } from "react-icons/md";
import { IoMdCreate, IoMdHome } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { NavLink } from "react-router-dom";
// import { useLogoutMutation } from "../../services/mutations";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UserModal({ name }: { name: string }) {
  const navigate = useNavigate();
  //   const { mutateAsync: logout } = useLogoutMutation();
  const handleLogout = () => {
    // toast.promise(logout(), {
    //   pending: "Logging out...",
    //   success: {
    //     render() {
    //       navigate("/login");
    //       return "Logout successful!";
    //     },
    //   },
    //   error: {
    //     render({ data }: { data: string }) {
    //       console.log(data);
    //       return (data as string) || "Logout failed!";
    //     },
    //   },
    // });
  };

  return (
    <div className="absolute right-0 my-4 w-64 bg-[rgb(255,253,252,.95)] rounded-md  text-gray-500 shadow-custom">
      <div className="px-4 py-2 border-b border-gray-600 text-sm">
        <p className="text-lg text-gray-500">
          Hello, <span className="font-bold text-[#004400]">{name}</span>
        </p>
      </div>
      <div className=" flex flex-col space-y-2 text-sm:text-lg">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            `px-4 py-2 hover:text-[#004400] cursor-pointer flex space-x-2 items-center ${
              isActive && "bg-[#EEEFF1] text-[#004400] font-semibold"
            }`
          }
        >
          <IoMdHome className="text-xl" /> <p>Home</p>
        </NavLink>
        <NavLink
          to={"/create-course"}
          className={({ isActive }) =>
            `px-4 py-2 hover:text-[#004400]  cursor-pointer flex space-x-2 items-center ${
              isActive && "bg-[#EEEFF1] text-[#004400] font-semibold"
            }`
          }
        >
          <IoMdCreate /> <p>Create ZipLink</p>
        </NavLink>
        <NavLink
          to={"/account-setting"}
          className={({ isActive }) =>
            `px-4 py-2 hover:text-[#004400] cursor-pointer flex space-x-2 items-center ${
              isActive && "bg-[#EEEFF1] text-[#004400] font-semibold"
            }`
          }
        >
          <IoSettings /> <p>Account & Settings</p>
        </NavLink>
      </div>

      <div className="px-4 py-2 border-t border-gray-600">
        <button
          onClick={handleLogout}
          className="flex space-x-2  text-lg  items-center hover:text-[#004400] cursor-pointer"
        >
          <MdOutlineLogout size={22} /> <p>Sign out</p>
        </button>
      </div>
    </div>
  );
}

export default UserModal;
