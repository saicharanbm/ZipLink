function Account() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-600 mb-4">ZipLink</h1>
        <p className="text-lg text-gray-400 mb-8">
          We're working hard to bring you something amazing!
        </p>
        <div className="flex justify-center items-center mb-6 ">
          <div className="w-32 h-32  relative rounded-full flex items-center justify-center border-2 border-gray-600 border-solid">
            <div className="absolute top-8 left-8 w-5 h-5 bg-[#1e5652] rounded-full"></div>
            <div className="absolute top-8 right-8 w-5 h-5 bg-[#1e5652] rounded-full"></div>

            <div className="absolute bottom-6 w-20 h-24 border-4 border-transparent  border-b-[#1e5652] rounded-b-full"></div>
          </div>
        </div>
        <p className="text-sm text-gray-500">Stay tuned for updates!</p>
      </div>
    </div>
  );
}

export default Account;
