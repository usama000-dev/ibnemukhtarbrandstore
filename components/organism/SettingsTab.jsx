import React from 'react'

const SettingsTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
  
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Language Preference</h3>
          <select className="w-full md:w-64 border rounded-md p-2">
            <option>English</option>
          </select>
        </div>
  
        <div>
          <h3 className="font-medium mb-3">Currency</h3>
          <select className="w-full md:w-64 border rounded-md p-2">
            <option>Pakistan (PKR)</option>
          </select>
        </div>
  
        <div>
          <h3 className="font-medium mb-3">Privacy Settings</h3>
          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" id="data-sharing" className="w-4 h-4" />
            <label htmlFor="data-sharing" className="text-sm">
              Allow data sharing for personalized recommendations
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="search-visibility"
              className="w-4 h-4"
              defaultChecked
            />
            <label htmlFor="search-visibility" className="text-sm">
              Include my public profile in search results
            </label>
          </div>
        </div>
  
        <div className="pt-4 border-t">
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
            Delete Account
          </button>
          <p className="text-xs text-gray-500 mt-2">
            This action cannot be undone. All your data will be permanently
            deleted.
          </p>
        </div>
      </div>
    </div>
  );

export default SettingsTab