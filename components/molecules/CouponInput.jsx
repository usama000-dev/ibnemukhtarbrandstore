// components/CouponInput.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CouponInput({ onApplyCoupon }) {
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true)
    if (!couponCode.trim()) {
      setMessage({ text: 'Please enter a coupon code', type: 'error' });
      setLoading(false)
      return;
    }

    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode })
      });
      
      const data = await response.json();
      
      if (response.ok) {
toast.success('Coupon applied successfully!')        
        onApplyCoupon(data);
        setMessage({ text: 'Coupon applied successfully!', type: 'success' });
      } else {
        setLoading(false)
        toast.warn(data.message||'Invalid coupon')
        setMessage({ text: data.message || 'Invalid coupon', type: 'error' });
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
      toast.error(error)
      setMessage({ text: 'Failed to apply coupon', type: 'error' });
    }
  };

  return (
    <div className="coupon-section">
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 p-2 border rounded outline-[#DD8560] outline-1 text-[#DD8560]"
        />
        <button 
          onClick={handleApply}
          className="bg-[#DD8560] text-white px-4 py-2 rounded"
        >
          {loading ? "Applying": " Apply"}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-sm ${
          message.type === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {message.text}
        </p>
      )}
    </div>
  );
}