import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import * as Label from "@radix-ui/react-label";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function Login() {
  const navigate = useNavigate();
  const { login, setLoading, setError, isLoading, error } = useAuthStore();
  const [apiError, setApiError] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    try {
      const res = await fetch("https://oms.wilerhub.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("Login response:", result);

      if (res.ok) {
        login(result, result.result.token);
        navigate("/", { replace: true });
      } else {
        const errorMessage = result.message || "Invalid email or password";
        setApiError(errorMessage);
        setError(errorMessage);
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        "Network error. Please check your connection and try again.";
      setApiError(errorMsg);
      setError(errorMsg);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Login</h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your credentials to access your account
        </p>

        <div className="mb-4">
          <Label.Root
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
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

        {/* Password Field */}
        <div className="mb-6">
          <Label.Root
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </Label.Root>
          <input
            id="password"
            type="password"
            disabled={isLoading}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
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

        {/* Hidden Device Token */}
        <input
          id="device_token"
          type="hidden"
          {...register("device_token")}
          value="1234"
        />

        {/* Submit Button */}
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
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-black font-medium hover:underline">
            Sign Up
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
              Login Failed
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
    </div>
  );
}
