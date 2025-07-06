import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX } = FiIcons;

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 h-fit"
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold-100 text-gold-800">
                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
              </div>
            </div>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-gold-600 hover:text-gold-700 font-medium"
                >
                  <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-gold-600 transition-colors"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiUser} className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiMail} className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiPhone} className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State / ZIP
                </label>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                      placeholder="ZIP Code"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 py-2">{formData.state} {formData.zipCode}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Change Password</h4>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <button className="text-gold-600 hover:text-gold-700 font-medium">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Manage your email preferences</p>
              </div>
              <button className="text-gold-600 hover:text-gold-700 font-medium">
                Manage
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Delete Account</h4>
                <p className="text-sm text-gray-600">Permanently delete your account</p>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;