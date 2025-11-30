"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  canCheckoutOrder,
  canUpdatePaymentMethod,
} from "@/lib/utils/permissions";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Slooze.xyz</h1>
                <p className="text-sm text-gray-600">
                  {user.name} • {user.role}{" "}
                  {user.country && `• ${user.country}`}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">
              Welcome to your food ordering dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              onClick={() => router.push("/dashboard/restaurants")}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Restaurants
              </h3>
              <p className="text-gray-600">Browse and manage restaurants</p>
            </div>

            <div
              onClick={() => router.push("/dashboard/orders")}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-green-500"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Orders
              </h3>
              <p className="text-gray-600">View and manage your orders</p>
            </div>

            {canUpdatePaymentMethod(user.role) && (
              <div
                onClick={() => router.push("/dashboard/payment-methods")}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-purple-500"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Payment Methods
                </h3>
                <p className="text-gray-600">Manage payment options</p>
              </div>
            )}
          </div>

          <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Your Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-5 h-5 rounded-full mt-0.5 ${
                    true ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <div>
                  <p className="font-medium text-gray-900">
                    View Restaurants & Menu Items
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.country
                      ? `Only from ${user.country}`
                      : "All countries"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className={`w-5 h-5 rounded-full mt-0.5 ${
                    true ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <div>
                  <p className="font-medium text-gray-900">Create Orders</p>
                  <p className="text-sm text-gray-600">Add items to cart</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className={`w-5 h-5 rounded-full mt-0.5 ${
                    canCheckoutOrder(user.role) ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <div>
                  <p className="font-medium text-gray-900">
                    Checkout & Cancel Orders
                  </p>
                  <p className="text-sm text-gray-600">
                    {canCheckoutOrder(user.role)
                      ? "Allowed"
                      : "Not allowed for members"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className={`w-5 h-5 rounded-full mt-0.5 ${
                    canUpdatePaymentMethod(user.role)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <div>
                  <p className="font-medium text-gray-900">
                    Update Payment Methods
                  </p>
                  <p className="text-sm text-gray-600">
                    {canUpdatePaymentMethod(user.role)
                      ? "Admin only"
                      : "Not allowed"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
