import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // npm install react-toastify
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const avatarFile = watch("avatar");
  const navigate = useNavigate();

  useEffect(() => {
    if (avatarFile && avatarFile[0]) {
      const file = avatarFile[0];
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [avatarFile]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("fullname", data.fullname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("avatar", data.avatar[0]); // file input

      const res = await axios.post(
        "http://localhost:4000/api/v1/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Registration successful! Please sign in.");
        navigate("/loginUser"); 
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center rounded-tl-3xl md:rounded-bl-3xl shadow-lg p-6">
        <div className="w-full md:w-3/4 max-w-md">
          <h2 className="text-3xl font-semibold mb-10 text-gray-800">
            Get Started Now
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                className={`w-full px-4 py-2 border ${
                  errors.username ? "border-red-500" : "border-[#D9D9D9]"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[a-z0-9]+$/,
                    message: "Username must be lowercase & unique",
                  },
                })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className={`w-full px-4 py-2 border ${
                  errors.fullname ? "border-red-500" : "border-[#D9D9D9]"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
                {...register("fullname", {
                  required: "Full Name is required",
                })}
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className={`w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-[#D9D9D9]"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-2 border cursor-pointer ${
                  errors.password ? "border-red-500" : "border-[#D9D9D9]"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 5,
                    message: "Password must be at least 5 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Avatar */}
            <div>
              <input
                type="file"
                accept="image/*"
                className={`w-full px-4 py-2 border cursor-pointer ${
                  errors.avatar ? "border-red-500" : "border-[#D9D9D9]"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
                {...register("avatar", {
                  required: "Avatar is required",
                })}
              />
              {errors.avatar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.avatar.message}
                </p>
              )}

              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="w-20 h-20 object-cover rounded-2xl border"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full text-white py-2 rounded-lg transition cursor-pointer"
              style={{ backgroundColor: "#3A5B22" }}
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/loginUser"
              className="text-[#0F3DDE] font-semibold underline py-2 rounded-lg"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="/Book_bg_6.jpg"
          alt="Signup"
          className="w-full h-full object-cover"
          style={{ borderTopLeftRadius: "2rem", borderBottomLeftRadius: "2rem" }}
        />
      </div>
    </div>
  );
};

export default SignUp;
