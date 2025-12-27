import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';

// Pro-level animated cart button
const ProAnimatedCartButton = ({ isCart, handleAddToCart, itemCount = 0 }) => {
  return (
    <motion.button
      onClick={handleAddToCart}
      whileHover={{ 
        scale: 1.15,
        y: -2,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
      }}
      whileTap={{ 
        scale: 0.85,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
      className="relative bg-white/90 p-3 rounded-full z-10 border border-gray-200 shadow-lg group-hover:bg-blue-50 transition-colors overflow-hidden"
      style={{
        background: isCart 
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
          : 'rgba(255, 255, 255, 0.9)'
      }}
    >
      {/* Background pulse effect */}
      <AnimatePresence>
        {isCart && (
          <motion.div
            className="absolute inset-0 bg-green-500 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.3 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Floating particles when added to cart */}
      <AnimatePresence>
        {isCart && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [1, 0.8, 0],
                  x: Math.cos(i * 120 * Math.PI / 180) * 25,
                  y: Math.sin(i * 120 * Math.PI / 180) * 25
                }}
                transition={{ 
                  duration: 0.8,
                  delay: i * 0.15,
                  repeat: 1
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Icon with smooth transition */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {isCart ? (
            <motion.div
              key="cart-filled"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15 
              }}
              className="text-white"
            >
              {/* Success check mark animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <FaCheck size={16} className="absolute -top-1 -right-1 bg-white text-green-500 rounded-full p-1" />
              </motion.div>
              <FaShoppingCart size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="cart-empty"
              initial={{ scale: 0, rotate: 180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: -180, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15 
              }}
              className="text-gray-600"
            >
              <AiOutlineShoppingCart size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Item count badge with bounce animation */}
      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
        >
          <motion.span
            key={itemCount}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {itemCount}
          </motion.span>
        </motion.div>
      )}

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-blue-400 pointer-events-none"
        initial={{ scale: 1, opacity: 0 }}
        whileTap={{ scale: 1.5, opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default ProAnimatedCartButton;