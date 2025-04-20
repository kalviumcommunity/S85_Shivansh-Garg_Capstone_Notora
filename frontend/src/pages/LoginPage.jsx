import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

const LoginPage = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">

      {/* Left Side */}
      <div className="w-full md:w-1/2 bg-[#9AC9DE] relative p-6 md:p-10 md:h-full">
        {/* Logo & Tagline aligned top-left */}
        <div className="flex flex-col items-start">
          <img
            src="/assets/enhanced-Photoroom.png"
            alt="Notora Logo"
            className="h-16 md:h-20 mb-1"
          />
          <p className="text-black-700 text-lg md:text-xl mt-2 font-medium">
            Simplify Your Study
          </p>
        </div>

        {/* Abstract Illustration (Hide on small screens) */}
        <img
          src="/assets/loginpage.png"
          alt="Abstract Design"
          className="absolute top-1/2 left-[75%] transform -translate-x-1/2 -translate-y-1/2 w-10/12 max-w-lg hidden lg:block"
        />
      </div>


      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white rounded-tl-lg rounded-bl-lg md:h-full">
        <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-center mb-6">
            Welcome Back!
          </h3>

          {/* Social Buttons */}
          <div className="flex mb-6 space-x-3 flex-col items-center">
            {/* Text Above Buttons */}
            <p className="text-sm font-medium text-gray-600 mb-4">Sign in with</p>

            {/* Buttons for Google, Facebook, GitHub, and X */}
            <div className="flex space-x-5">
              <button className="p-3 rounded-full hover:bg-[#e6f3f9] hover:shadow-[0_0_20px_5px_rgba(156,201,222,0.7)] transition duration-300 ease-in-out">
                <FcGoogle className="text-2xl" />
              </button>
              <button className="p-3 rounded-full hover:bg-[#e6f0fb] hover:shadow-[0_0_20px_5px_rgba(24,119,242,0.7)] transition duration-300 ease-in-out">
                <FaFacebookF className="text-2xl text-[#1877F2]" />
              </button>
              <button className="p-3 rounded-full hover:bg-[#f1f1f1] hover:shadow-[0_0_20px_5px_rgba(0,0,0,0.3)] transition duration-300 ease-in-out">
                <FaGithub className="text-2xl text-black" />
              </button>
              <button className="p-3 rounded-full hover:bg-[#e8f4fc] hover:shadow-[0_0_20px_5px_rgba(29,155,240,0.7)] transition duration-300 ease-in-out">
                <FaXTwitter className="text-2xl text-black" />
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center mb-6">
            <hr className="flex-1 border-t border-gray-300" />
            <span className="px-3 text-gray-400">- OR -</span>
            <hr className="flex-1 border-t border-gray-300" />
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border-b-2 border-gray-300 focus:border-[#9AC9DE] outline-none py-2 placeholder-gray-500 placeholder-opacity-10"
              />
            </div> */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border-b-2 border-gray-300 focus:border-[#9AC9DE] outline-none py-2 placeholder-gray-500"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full border-b-2 border-gray-300 focus:border-[#9AC9DE] outline-none py-2 placeholder-gray-500 pr-8"
              />
              <FiLock className="absolute right-0 bottom-2 text-gray-400" />
            </div>

            <button
              type="submit"
              className="w-full bg-[#9AC9DE] hover:bg-[#8bbacb] text-black font-semibold py-2 rounded-xl mt-4 text-sm"
            >
              Sign in
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an Account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;