function ShimmerSideBar() {
  return (
    <div className="h-screen bg-[#fffdfc] fixed w-16 p-2 animate-pulse flex flex-col gap-4 border-r-[1px] border-gray-200">
      <div className="h-12 bg-[#EEEFF1] rounded-md mb-6"></div>

      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-12 bg-[#EEEFF1] rounded-md"></div>
      ))}
    </div>
  );
}

export default ShimmerSideBar;
