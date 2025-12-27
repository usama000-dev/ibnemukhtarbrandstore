'use client';
import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnnouncementBar - Animated scrolling announcement bar component
 * 
 * @param {Object} props
 * @param {string|Array<string>} props.messages - Single message or array of messages to display
 * @param {string} props.bgColor - Background color (default: 'bg-gradient-to-r from-purple-600 to-pink-600')
 * @param {string} props.textColor - Text color (default: 'text-white')
 * @param {string} props.height - Height of the bar (default: 'h-10')
 * @param {number} props.speed - Animation speed in seconds (default: 20)
 * @param {string} props.fontSize - Font size (default: 'text-sm')
 * @param {string} props.fontWeight - Font weight (default: 'font-semibold')
 * @param {string} props.icon - Optional icon/emoji to show before each message
 * @param {boolean} props.pauseOnHover - Pause animation on hover (default: true)
 * @param {string} props.separator - Separator between messages (default: '•')
 */
export default function AnnouncementBar({
    messages = ['Welcome to our store! 🎉', 'Free shipping on orders over Rs. 2000', 'Limited time offer - 20% off!'],
    bgColor = 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600',
    textColor = 'text-white',
    height = 'h-10',
    speed = 20,
    fontSize = 'text-sm',
    fontWeight = 'font-semibold',
    icon = '🎉',
    pauseOnHover = true,
    separator = '•'
}) {
    // Convert single message to array
    const messageArray = Array.isArray(messages) ? messages : [messages];

    // Create a string with all messages separated
    const fullMessage = messageArray.map(msg => `${icon} ${msg}`).join(` ${separator} `);

    // Duplicate the message for seamless loop
    const duplicatedMessage = `${fullMessage} ${separator} ${fullMessage} ${separator} ${fullMessage}`;

    return (
        <div className={`${bgColor} ${height} overflow-hidden relative flex items-center`}>
            <motion.div
                className={`flex items-center whitespace-nowrap ${textColor} ${fontSize} ${fontWeight}`}
                animate={{
                    x: [0, -1000],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear",
                    },
                }}
                whileHover={pauseOnHover ? { animationPlayState: 'paused' } : {}}
                style={{
                    paddingRight: '2rem',
                }}
            >
                <span className="inline-block px-4">{duplicatedMessage}</span>
                <span className="inline-block px-4">{duplicatedMessage}</span>
                <span className="inline-block px-4">{duplicatedMessage}</span>
            </motion.div>

            {/* Gradient fade on edges for smooth effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-purple-600 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-pink-600 to-transparent pointer-events-none"></div>
        </div>
    );
}
