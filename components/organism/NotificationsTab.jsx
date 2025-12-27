import React from 'react'

const NotificationsTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-6">Notifications</h2>
      <div className="space-y-4">
        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium">Order Updates</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600">
            Get notifications about your order status
          </p>
        </div>
  
        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium">Promotions & Discounts</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600">
            Receive offers, discounts and newsletter
          </p>
        </div>
  
        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium">Stock Alerts</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600">
            Get notified when wishlist items are back in stock
          </p>
        </div>
      </div>
    </div>
  );

export default NotificationsTab