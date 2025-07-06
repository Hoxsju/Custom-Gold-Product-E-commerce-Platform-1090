import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiPackage, FiDollarSign, FiTrendingUp, FiEdit, FiTrash2 } = FiIcons;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12.5%',
      icon: FiDollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Total Orders',
      value: '145',
      change: '+8.2%',
      icon: FiPackage,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Active Customers',
      value: '89',
      change: '+15.3%',
      icon: FiUsers,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Growth Rate',
      value: '23.1%',
      change: '+5.4%',
      icon: FiTrendingUp,
      color: 'text-gold-600 bg-gold-100'
    }
  ];

  const orders = [
    {
      id: 'ORD-001',
      customer: 'John Smith',
      email: 'john@example.com',
      total: 299.99,
      status: 'processing',
      date: '2024-01-25',
      customization: 'Custom text: "John Smith"'
    },
    {
      id: 'ORD-002',
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      total: 599.98,
      status: 'shipped',
      date: '2024-01-24',
      customization: 'Logo engraving'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Wilson',
      email: 'mike@example.com',
      total: 299.99,
      status: 'delivered',
      date: '2024-01-23',
      customization: 'Custom text: "Anniversary 2024"'
    }
  ];

  const customers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      orders: 3,
      totalSpent: 899.97,
      lastOrder: '2024-01-25'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      orders: 2,
      totalSpent: 599.98,
      lastOrder: '2024-01-24'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@example.com',
      orders: 1,
      totalSpent: 299.99,
      lastOrder: '2024-01-23'
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your e-commerce business</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-gold-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-white text-gold-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'customers'
                  ? 'bg-white text-gold-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Customers
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <SafeIcon icon={stat.icon} className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order, index) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-gold-300 to-gold-600 rounded-lg flex items-center justify-center">
                        <span className="text-gold-900 font-bold text-xs">G</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                      <p className="text-lg font-bold text-gray-900 mt-1">${order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">All Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-gold-600 hover:text-gold-900">
                            <SafeIcon icon={FiEdit} className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Customer Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${customer.totalSpent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.lastOrder}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-gold-600 hover:text-gold-900">
                            <SafeIcon icon={FiEdit} className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;