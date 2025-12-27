'use client';
import Image from 'next/image';
import Link from 'next/link';
import { SystemProduct } from '../types';

interface ShoppingResultCardProps {
    product: SystemProduct;
}

export default function ShoppingResultCard({ product }: ShoppingResultCardProps) {
    return (
        <Link href={product.link} className="group block">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20">
                {/* Image Area */}
                <div className="relative aspect-square w-full bg-black/50 p-4">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badge */}
                    <div className="absolute top-2 left-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${product.type === 'product' ? 'bg-blue-600/90 text-white' : 'bg-purple-600/90 text-white'}`}>
                            {product.type}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="text-white font-medium line-clamp-2 min-h-[3rem] group-hover:text-blue-400 transition-colors">
                        {product.title}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Price</span>
                            <span className="text-lg font-bold text-white">
                                {product.price > 0 ? `Rs. ${product.price.toLocaleString()}` : 'View Details'}
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
