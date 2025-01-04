import NavBar from "./components/navbar/NavBar";
import SideBar from "./components/SideBar";
import ShimmerSideBar from "./components/shimmer/ShimmerSideBar.tsx";
import useIsDesktop from "./hooks/useIsDesktop";
import useAuth from "./hooks/useAuth";
import { Outlet } from "react-router-dom";

function App() {
  const { userData, isLoading } = useAuth();
  const isDesktop = useIsDesktop();

  return (
    <div className="w-full min-h-screen pt-16">
      <NavBar userData={userData} />
      {userData && isDesktop && <SideBar />}

      {isLoading && isDesktop && <ShimmerSideBar />}
      <div className="px-4 sm:pl-24 sm:pr-10">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
