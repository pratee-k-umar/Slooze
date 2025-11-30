"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { restaurantsApi } from "@/lib/api/restaurants";
import { menuItemsApi } from "@/lib/api/menu-items";
import { ordersApi } from "@/lib/api/orders";
import { Restaurant } from "@/types/restaurant";
import { MenuItem } from "@/types/menu-item";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    loadData();
    loadCartFromStorage();
  }, [restaurantId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [restaurantData, menuData] = await Promise.all([
        restaurantsApi.getById(restaurantId),
        menuItemsApi.getByRestaurant(restaurantId),
      ]);
      setRestaurant(restaurantData);
      setMenuItems(menuData);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem(`cart_${restaurantId}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const updateCart = (newCart: { [key: string]: number }) => {
    setCart(newCart);
    localStorage.setItem(`cart_${restaurantId}`, JSON.stringify(newCart));
  };

  const removeFromCart = (itemId: string) => {
    const newCart = { ...cart };
    if (newCart[itemId] > 1) {
      newCart[itemId]--;
    } else {
      delete newCart[itemId];
    }
    updateCart(newCart);
  };

  const addToCart = (itemId: string) => {
    updateCart({ ...cart, [itemId]: (cart[itemId] || 0) + 1 });
  };

  const clearCart = () => {
    updateCart({});
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find((m) => m.id === itemId);
      return total + (Number(item?.price) || 0) * quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const createOrder = async () => {
    if (Object.keys(cart).length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setCreatingOrder(true);
      setError("");
      console.log('Creating order for restaurant:', restaurantId);
      const order = await ordersApi.create({ restaurantId });
      console.log('Order created:', order);

      for (const [menuItemId, quantity] of Object.entries(cart)) {
        console.log('Adding item:', menuItemId, 'quantity:', quantity);
        await ordersApi.addItem(order.id, { menuItemId, quantity });
      }

      clearCart();
      router.push(`/dashboard/orders/${order.id}`);
    } catch (err: any) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.error?.message || err.response?.data?.message || "Failed to create order");
    } finally {
      setCreatingOrder(false);
    }
  };

  if (!user) return null;

  const cartItems = Object.entries(cart)
    .map(([itemId, quantity]) => {
      const item = menuItems.find((m) => m.id === itemId);
      return item ? { ...item, quantity } : null;
    })
    .filter(Boolean);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    router.push(`/dashboard/restaurants/${restaurantId}`)
                  }
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  ← Back to Menu
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
              </div>
              <div className="text-sm text-gray-600">
                {getTotalItems()} item(s)
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Loading cart...</div>
            </div>
          ) : Object.keys(cart).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600 mb-4">
                Your cart is empty
              </div>
              <button
                onClick={() =>
                  router.push(`/dashboard/restaurants/${restaurantId}`)
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cart Items
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 font-medium text-sm cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>

                {restaurant && (
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {restaurant.address}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {cartItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        <p className="text-sm font-medium text-blue-600">
                          ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 ml-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-semibold text-gray-900 w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right w-24">
                          <p className="font-bold text-gray-900">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6 mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">
                      Subtotal ({getTotalItems()} items):
                    </span>
                    <span className="text-xl font-semibold text-gray-900">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-2xl font-bold mt-4">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ready to order?
                </h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to create your order. You'll be able to
                  review and complete checkout on the next page.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/restaurants/${restaurantId}`)
                    }
                    className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={createOrder}
                    disabled={creatingOrder}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    {creatingOrder ? "Creating Order..." : "Create Order"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
