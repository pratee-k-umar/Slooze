"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ordersApi } from "@/lib/api/orders";
import { paymentMethodsApi } from "@/lib/api/payment-methods";
import { Order } from "@/types/order";
import { PaymentMethod } from "@/types/payment-method";
import { canCheckoutOrder, canCancelOrder } from "@/lib/utils/permissions";

export default function OrderDetailsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [cancelProcessing, setCancelProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, [orderId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orderData, paymentMethodsData] = await Promise.all([
        ordersApi.getById(orderId),
        paymentMethodsApi.getAll(),
      ]);
      setOrder(orderData);
      setPaymentMethods(paymentMethodsData.filter((pm) => pm.isActive));
      if (paymentMethodsData.length > 0) {
        setSelectedPaymentMethod(paymentMethodsData[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      setError("Please select a payment method");
      return;
    }

    try {
      setOrderProcessing(true);
      setError("");
      console.log(
        "Checking out order:",
        orderId,
        "with payment method:",
        selectedPaymentMethod
      );
      await ordersApi.checkout(orderId, {
        paymentMethodId: selectedPaymentMethod,
      });
      await loadData();
      alert("Order checked out successfully!");
    } catch (err: any) {
      console.error("Checkout error:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        err.message ||
        "Failed to checkout order";
      setError(errorMessage);
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelProcessing(true);
      setError("");
      await ordersApi.cancel(orderId);
      await loadData();
      alert("Order cancelled successfully!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        err.message ||
        "Failed to cancel order";
      setError(errorMessage);
    } finally {
      setCancelProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/dashboard/orders")}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  ← Back to Orders
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h1>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Loading order...</div>
            </div>
          ) : !order ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Order not found</div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Order #{order.id.substring(0, 8)}
                    </h2>
                    <p className="text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}{" "}
                      at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                {order.restaurant && (
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Restaurant
                    </h3>
                    <p className="text-gray-700">{order.restaurant.name}</p>
                    <p className="text-sm text-gray-600">
                      {order.restaurant.address}
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {order.orderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center border-b pb-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.menuItem?.name || "Item"}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${Number(item.price).toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${Number(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Payment Status:{" "}
                    <span className="font-medium">{order.paymentStatus}</span>
                  </div>
                  {order.paymentMethod && (
                    <div className="mt-1 text-sm text-gray-600">
                      Payment Method:{" "}
                      <span className="font-medium">
                        {order.paymentMethod.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {order.status === "pending" && canCheckoutOrder(user.role) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Checkout
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Payment Method
                    </label>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black cursor-pointer"
                    >
                      {paymentMethods.map((pm) => (
                        <option key={pm.id} value={pm.id}>
                          {pm.name} ({pm.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={orderProcessing}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    {orderProcessing ? "Processing..." : "Complete Checkout"}
                  </button>
                </div>
              )}

              {order.status !== "cancelled" &&
                order.status !== "delivered" &&
                canCancelOrder(user.role) && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Cancel Order
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You can cancel this order if needed. This action cannot be
                      undone.
                    </p>
                    <button
                      onClick={handleCancel}
                      disabled={cancelProcessing}
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      {cancelProcessing ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
