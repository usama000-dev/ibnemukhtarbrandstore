export default function CouponBanner({ onClose }) {
    return (
      <div className="bg-yellow-50 border border-dashed border-yellow-400 p-3 mx-3 my-2 rounded-md text-center text-sm relative">
        <div className="flex items-center justify-center">
          <span className="bg-red-600 text-white px-2 py-1 rounded-l text-xs">HOT</span>
          <span className="bg-white text-red-600 px-2 py-1 border border-red-600 rounded-r text-xs">
            Use code: <span className="font-bold">NEWUSER10</span> for extra 10% off
          </span>
        </div>
        <button 
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 text-lg"
        >
          &times;
        </button>
      </div>
    );
  }