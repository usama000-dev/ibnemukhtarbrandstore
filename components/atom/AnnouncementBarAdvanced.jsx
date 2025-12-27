'use client';
import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnnouncementBarAdvanced - Advanced animated announcement bar with multiple animation styles
 * 
 * @param {Object} props
 * @param {string|Array<string>} props.messages - Single message or array of messages to display
 * @param {string} props.bgColor - Background color (default: gradient)
 * @param {string} props.textColor - Text color (default: 'text-white')
 * @param {string} props.height - Height of the bar (default: 'h-12')
 * @param {number} props.speed - Animation speed in seconds (default: 25)
 * @param {string} props.fontSize - Font size (default: 'text-sm md:text-base')
 * @param {string} props.fontWeight - Font weight (default: 'font-bold')
 * @param {string} props.icon - Optional icon/emoji to show before each message
 * @param {boolean} props.pauseOnHover - Pause animation on hover (default: true)
 * @param {string} props.separator - Separator between messages (default: '★')
 * @param {string} props.animationType - Animation type: 'scroll', 'fade', 'slide' (default: 'scroll')
 * @param {boolean} props.glowEffect - Add glow effect (default: true)
 */
export default function AnnouncementBarAdvanced({
    messages = ['Welcome to our store! 🎉', 'Free shipping on orders over Rs. 2000', 'Limited time offer - 20% off!'],
    bgColor = 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600',
    textColor = 'text-white',
    height = 'h-12',
    speed = 25,
    fontSize = 'text-sm md:text-base',
    fontWeight = 'font-bold',
    icon = '⚡',
    pauseOnHover = true,
    separator = '★',
    animationType = 'scroll',
    glowEffect = true
}) {
    // Convert single message to array
    const messageArray = Array.isArray(messages) ? messages : [messages];

    // Create a string with all messages separated
    const fullMessage = messageArray.map(msg => `${icon} ${msg}`).join(` ${separator} `);

    // Duplicate the message for seamless loop
    const duplicatedMessage = `${fullMessage} ${separator} ${fullMessage} ${separator} ${fullMessage}`;

    return (
        <div className={`${bgColor} ${height} overflow-hidden relative flex items-center ${glowEffect ? 'shadow-lg' : ''}`}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)',
                    }}
                    animate={{
                        backgroundPosition: ['0px 0px', '40px 40px'],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            </div>

            {/* Main scrolling text */}
            <motion.div
                className={`flex items-center whitespace-nowrap ${textColor} ${fontSize} ${fontWeight} relative z-10`}
                animate={{
                    x: [0, -1200],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear",
                    },
                }}
                whileHover={pauseOnHover ? {
                    scale: 1.05,
                    transition: { duration: 0.2 }
                } : {}}
                style={{
                    paddingRight: '2rem',
                    textShadow: glowEffect ? '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)' : 'none',
                }}
            >
                <span className="inline-block px-6">{duplicatedMessage}</span>
                <span className="inline-block px-6">{duplicatedMessage}</span>
                <span className="inline-block px-6">{duplicatedMessage}</span>
                <span className="inline-block px-6">{duplicatedMessage}</span>
            </motion.div>

            {/* Gradient fade on edges for smooth effect */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-purple-600 to-transparent pointer-events-none z-20"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-red-600 to-transparent pointer-events-none z-20"></div>

            {/* Animated shine effect */}
            {glowEffect && (
                <motion.div
                    className="absolute inset-0 pointer-events-none z-30"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                        width: '200px',
                    }}
                    animate={{
                        x: ['-200px', '100%'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                        repeatDelay: 1,
                    }}
                />
            )}
        </div>
    );
}
