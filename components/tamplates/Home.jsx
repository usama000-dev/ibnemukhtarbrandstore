'use client';
import React from 'react';
import Banner from '../organism/Banner';
import OverviewSection from '../organism/OverviewSection';
import DealSection from '../atom/DealSection';
import FlashSale from '../atom/FlashSale';
import LimitedDeals from '../atom/LimitedDeals';
import UnderPriceDeals from '../atom/UnderPriceDeals';
import FeaturedProducts from '../atom/FeaturedProducts';
import CustomerReviews from '../atom/CustomerReviews';
import Recommended from '../atom/Recommended';
import FooterSirProject from '../organism/FooterSirProject';
import CategoryGrid from '../atom/CategoryGrid';
import Componies from '../organism/Componies';
import EmailSubscriptionForm from '../EmailSubscriptionForm';
import WinterBanner from '../atom/WinterBanner';
import WhyChooseUs from '../atom/WhyChooseUs';
import TrustBadges from '../atom/TrustBadges';
import QualityPromise from '../atom/QualityPromise';
import AffordableFashion from '../atom/AffordableFashion';
import FastDelivery from '../atom/FastDelivery';
import CustomerTestimonials from '../atom/CustomerTestimonials';
import LatestBlogs from '../atom/LatestBlogs';
import AnnouncementBar from '../atom/AnnouncementBar';
import AnnouncementBarAdvanced from '../atom/AnnouncementBarAdvanced';

export default function Home() {
  return (
    <div className="min-h-screen pb-20">

      <Banner />
      {/* <AnnouncementBar
        messages={[
          'Welcome to Ibnemukhtar Brand Store! خوش آمدید 🎉',
          'Free Shipping on Orders Over Rs. 2000 📦',
          'Limited Time Offer - Up to 30% Off! 🔥',
          'Cash on Delivery Available 💰'
        ]}
        bgColor="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
        speed={25}
        icon="✨"
      /> */}
      <AnnouncementBarAdvanced
        messages={[
          'Special Eid Sale - Up to 50% Off! 🌙',
          'New Collection Available Now 🎁',
          'Free Delivery Across Pakistan 🚚'
        ]}
        bgColor="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600"
        speed={20}
        icon="⚡"
        glowEffect={true}
        separator="★"
      />
      <CategoryGrid />
      <LimitedDeals />
      {/* <TrustBadges /> */}
      <Recommended />
      <QualityPromise />
      <Componies />
      <AffordableFashion />
      {/* <DealSection /> */}
      <FlashSale />
      {/* <UnderPriceDeals /> */}
      <FeaturedProducts />
      <FastDelivery />
      <WinterBanner />
      <CustomerReviews />
      {/* <CustomerTestimonials /> */}
      <WhyChooseUs />
      <LatestBlogs />
      <div className="container mx-auto px-4 py-12">
        <EmailSubscriptionForm />
      </div>
      <OverviewSection />
      <FooterSirProject />
    </div>
  );
}