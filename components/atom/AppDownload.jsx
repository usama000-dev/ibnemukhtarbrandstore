export default function AppDownload() {
    return (
      <div className="bg-blue-600 text-white p-4 mt-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold">Download the App</h3>
          <p className="text-sm">Get $20 coupon for first order</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-black text-white px-3 py-1 rounded text-xs">
            App Store
          </button>
          <button className="bg-black text-white px-3 py-1 rounded text-xs">
            Google Play
          </button>
        </div>
      </div>
    );
  }