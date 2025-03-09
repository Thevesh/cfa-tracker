import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InspirationQuoteProps {
  quote: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function InspirationQuote({ quote, isVisible, onClose }: InspirationQuoteProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            filter: [
              'brightness(100%)',
              'brightness(150%)',
              'brightness(100%)',
              'brightness(120%)',
              'brightness(100%)'
            ]
          }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            duration: 0.5,
            filter: {
              duration: 0.3,
              times: [0, 0.2, 0.4, 0.6, 1]
            }
          }}
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          onClick={onClose}
        >
          <motion.div 
            className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-blue-200 max-w-2xl"
            initial={{ boxShadow: "0 0 0 rgba(59, 130, 246, 0)" }}
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.1)",
                "0 0 40px rgba(59, 130, 246, 0.2)",
                "0 0 20px rgba(59, 130, 246, 0.1)"
              ]
            }}
            transition={{
              boxShadow: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          >
            <p className="text-xl md:text-2xl text-gray-800 font-medium text-center font-serif italic">
              &ldquo;{quote}&rdquo;
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 