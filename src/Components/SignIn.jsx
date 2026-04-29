const SignIn = ({ setIsLogin }) => {
  return (
    <>
      <div className="lg:w-1/3 w-full lg:py-12 p-5 mx-auto">
        <h1 className="font-bold text-center">Rabta</h1>
        <div className="border border-gray-100 bg-white shadow-2xl lg:p-18 p-8 flex flex-col gap-3.5">
          <form action="" className="">
            <div className="flex flex-col gap-1">
              <label className="text-sm">Email</label>
              <input
                className="lg:p-2 p-1 border outline-0 border-gray-200 rounded-lg"
                type="text"
              />
              <p className="text-sm text-red-600"></p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm">Password</label>
              <input
                className="lg:p-2 p-1 border outline-0 border-gray-200 rounded-lg"
                type="text"
              />
              <p className="text-sm text-red-600"></p>
            </div>

            <p className="text-sm text-red-600"></p>

            <div className="flex flex-col gap-1">
              <input
                className="bg-[#3B82F6] text-white uppercase cursor-pointer lg:p-2 p-1 border outline-0 border-gray-200 rounded-lg"
                type="submit"
                value="Submit"
              />
            </div>
          </form>
          <button
            onClick={() => setIsLogin(false)}
            className="cursor-pointer lg:p-2 p-1 border outline-0 border-gray-200 rounded-lg"
          >
            Create new account
          </button>
        </div>
      </div>
    </>
  );
};

export default SignIn;
