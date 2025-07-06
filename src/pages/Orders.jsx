import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPackage, FiClock, FiCheck, FiTruck, FiEye } = FiIcons;

const Orders = () => {
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: 1,
      customization: 'Custom text: "John Smith"',
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-01-20'
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'processing',
      total: 599.98,
      items: 2,
      customization: 'Logo engraving',
      trackingNumber: null,
      estimatedDelivery: '2024-01-30'
    },
    {
      id: 'ORD-003',
      date: '2024-01-25',
      status: 'shipped',
      total: 299.99,
      items: 1,
      customization: 'Custom text: "Anniversary 2024"',
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-28'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return FiCheck;
      case 'shipped':
        return FiTruck;
      case 'processing':
        return FiClock;
      default:
        return FiPackage;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </motion.div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-300 to-gold-600 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={getStatusIcon(order.status)} className="w-6 h-6 text-gold-900" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <p className="text-sm text-gray-600">Placed on {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      <SafeIcon icon={getStatusIcon(order.status)} className="w-4 h-4 mr-1" />
                      {order.status}
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-1">${order.total}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-semibold">{order.items} item(s)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customization</p>
                    <p className="font-semibold text-sm">{order.customization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-semibold">{order.estimatedDelivery}</p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                    <p className="font-mono text-sm font-semibold">{order.trackingNumber}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {order.status === 'delivered' && (
                      <span className="text-green-600 text-sm font-medium">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 inline mr-1" />
                        Delivered
                      </span>
                    )}
                    {order.status === 'shipped' && (
                      <span className="text-blue-600 text-sm font-medium">
                        <SafeIcon icon={FiTruck} className="w-4 h-4 inline mr-1" />
                        In Transit
                      </span>
                    )}
                    {order.status === 'processing' && (
                      <span className="text-yellow-600 text-sm font-medium">
                        <SafeIcon icon={FiClock} className="w-4 h-4 inline mr-1" />
                        Being Prepared
                      </span>
                    )}
                  </div>
                  <button className="flex items-center space-x-2 text-gold-600 hover:text-gold-700 font-medium">
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              {/* Order Progress */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center space-x-2 ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'text-gold-600' : 'text-gray-400'}`}>
                    <div className={`w-3 h-3 rounded-full ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-gold-600' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium">Processing</span>
                  </div>
                  <div className={`w-16 h-0.5 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-gold-600' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center space-x-2 ${order.status === 'shipped' || order.status === 'delivered' ? 'text-gold-600' : 'text-gray-400'}`}>
                    <div className={`w-3 h-3 rounded-full ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-gold-600' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium">Shipped</span>
                  </div>
                  <div className={`w-16 h-0.5 ${order.status === 'delivered' ? 'bg-gold-600' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center space-x-2 ${order.status === 'delivered' ? 'text-gold-600' : 'text-gray-400'}`}>
                    <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-gold-600' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium">Delivered</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;