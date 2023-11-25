"use client";
import React from 'react';
import AiBoothComponent from './components/AiBooth.client';

const Page: React.FC = () => {
  return (
    <div className="container mx-auto p-2">
      <div className="flex items-center justify-center ">
        <h1 className="text-4xl font-bold mr-2">AiBooth</h1>
        <img src="/kissflow.png" alt="Logo" className="w-14 h-14" /> {/* Adjust size as needed */}
      </div>
      <h2 className="text-xl font-bold text-center mb-8">Get Ready for the AI Magic</h2>
      
      <AiBoothComponent />
    </div>
  );
};

export default Page;
