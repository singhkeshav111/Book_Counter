import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/users/loginUser",
        data,
        { withCredentials: true }
      );

      toast.success("Login successful! 🎉");

      // Save token if your backend sends it
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Left Side Image */}
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="/Book_bg_7.jpg"
          alt="Sign In"
          className="w-full h-full object-cover"
          style={{
            borderTopRightRadius: "2rem",
            borderBottomRightRadius: "2rem",
          }}
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center rounded-tr-3xl md:rounded-br-3xl shadow-lg p-6">
        <div className="w-full md:w-3/4 max-w-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600 mb-8">
            Enter your Credentials to access your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username or Email"
                className={`w-full px-4 py-2 border ${
                  errors.identifier ? "border-red-500" : "border-[#D9D9D9]"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
                {...register("identifier", {
                  required: "Username or Email is required",
                })}
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-[#D9D9D9]"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full text-white py-2 rounded-lg transition"
              style={{ backgroundColor: "#3A5B22" }}
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#3A5B22] font-semibold underline py-2 rounded-lg"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
