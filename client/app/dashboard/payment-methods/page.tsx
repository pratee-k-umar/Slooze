'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { paymentMethodsApi } from '@/lib/api/payment-methods';
import { PaymentMethod } from '@/types/payment-method';
import { canUpdatePaymentMethod } from '@/lib/utils/permissions';

export default function PaymentMethodsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user && !canUpdatePaymentMethod(user.role)) {
      router.push('/dashboard');
      return;
    }
    loadPaymentMethods();
  }, [user]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const data = await paymentMethodsApi.getAll();
      setPaymentMethods(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setUpdating(id);
      setError('');
      await paymentMethodsApi.update(id, !currentStatus);
      await loadPaymentMethods();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update payment method');
    } finally {
      setUpdating(null);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      credit_card: '💳',
      debit_card: '💳',
      upi: '📱',
      cash: '💵',
    };
    return icons[type] || '💰';
  };

  if (!user) return null;

  if (!canUpdatePaymentMethod(user.role)) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">Only administrators can manage payment methods.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button onClick={() => router.push('/dashboard')} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  ← Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
              </div>
              <div className="text-sm text-gray-600">
                Admin Panel
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

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Manage Payment Methods</h2>
            <p className="text-gray-600 mb-4">
              Enable or disable payment methods for the entire platform. Disabled methods will not be available for checkout.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Loading payment methods...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-blue-500 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{getTypeIcon(method.type)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">
                          Type: {method.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(method.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right mr-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            method.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {method.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleStatus(method.id, method.isActive)}
                        disabled={updating === method.id}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${
                          method.isActive
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        } disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer`}
                      >
                        {updating === method.id
                          ? 'Updating...'
                          : method.isActive
                          ? 'Disable'
                          : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ Information</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Active payment methods are available for users during checkout</li>
              <li>• Disabled payment methods will not appear in the checkout options</li>
              <li>• Changes take effect immediately across the platform</li>
              <li>• Only administrators can manage payment methods</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
