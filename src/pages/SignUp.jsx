// src/pages/SignUp.jsx
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Label from "@radix-ui/react-label";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useAuthStore } from "../store/useAuthStore";

export default function SignUp() {
  const navigate = useNavigate();
  const { setLoading, isLoading } = useAuthStore();
  const [apiError, setApiError] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      mode: 1,
      sno: 0,
      device_token: "1234",
      info: "Web Application",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    const payload = {
      name: data.name,
      compname: data.compname,
      email: data.email,
      phone: data.phone,
      password: data.password,
      type: data.type,
      device_token: data.device_token,
      info: data.info,
      mode: data.mode,
      sno: data.sno,
    };

    try {
      const res = await fetch("https://oms.wilerhub.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Signup response:", result);

      if (res.ok) {
        setShowSuccessDialog(true);
        reset();
      } else {
        const errorMessage =
          result.message || "Signup failed. Please try again.";
        setApiError(errorMessage);
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg =
        "Network error. Please check your connection and try again.";
      setApiError(errorMsg);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Sign Up</h2>
        <p className="text-center text-gray-500 mb-6">
          Create your account by filling the details below
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <Label.Root
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name <span className="text-red-500">*</span>
          </Label.Root>
          <input
            id="name"
            disabled={isLoading}
            {...register("name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Company Name */}
        <div className="mb-4">
          <Label.Root
            htmlFor="compname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company Name <span className="text-red-500">*</span>
          </Label.Root>
          <input
            id="compname"
            disabled={isLoading}
            {...register("compname", {
              required: "Company name is required",
              minLength: {
                value: 2,
                message: "Company name must be at least 2 characters",
              },
            })}
            placeholder="Acme Corp"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {errors.compname && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.compname.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <Label.Root
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email <span className="text-red-500">*</span>
          </Label.Root>
          <input
            id="email"
            type="email"
            disabled={isLoading}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                message: "Invalid email format",
              },
            })}
            placeholder="john@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <Label.Root
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number <span className="text-red-500">*</span>
          </Label.Root>
          <input
            id="phone"
            type="tel"
            disabled={isLoading}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits",
              },
            })}
            placeholder="4156454445"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Type (6 digit code) */}
        <div className="mb-4">
          <Label.Root
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type Code (6 digits) <span className="text-red-500">*</span>
          </Label.Root>
          <input
            id="type"
            type="text"
            disabled={isLoading}
            {...register("type", {
              required: "Type code is required",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Type code must be exactly 6 digits",
              },
            })}
            placeholder="123456"
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {errors.type && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.type.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label.Root
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password <span className="text-red-500">*</span>
          </Label.Root>
          <input
            id="password"
            type="password"
            disabled={isLoading}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <Label.Root
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password <span className="text-red-500">*</span>
          </Label.Root>
          <input
            id="confirmPassword"
            type="password"
            disabled={isLoading}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Hidden Fields */}
        <input type="hidden" {...register("mode")} />
        <input type="hidden" {...register("sno")} />
        <input type="hidden" {...register("device_token")} />
        <input type="hidden" {...register("info")} />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>

      {/* Error Alert Dialog */}
      <AlertDialog.Root
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-white rounded-lg shadow-lg p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <AlertDialog.Title className="text-lg font-semibold text-gray-900 mb-2">
              Signup Failed
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-gray-600 mb-6">
              {apiError}
            </AlertDialog.Description>
            <div className="flex justify-end">
              <AlertDialog.Action asChild>
                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition">
                  Try Again
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      {/* Success Alert Dialog */}
      <AlertDialog.Root
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-white rounded-lg shadow-lg p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <AlertDialog.Title className="text-lg font-semibold text-green-900 mb-2">
              Account Created Successfully!
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-gray-600 mb-6">
              Your account has been created. You can now login with your
              credentials.
            </AlertDialog.Description>
            <div className="flex justify-end">
              <AlertDialog.Action asChild>
                <button
                  onClick={handleSuccessClose}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
                >
                  Go to Login
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
