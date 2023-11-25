import React from 'react';
import { useRouter } from 'next/router';

const DisplayImage = () => {
  const router = useRouter();
  const { imageUrl } = router.query;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-br from-purple-500 to-black">
      <h1 className="text-4xl font-bold text-white mb-8">Processed Image</h1>
      {imageUrl && <img src={imageUrl as string} alt="Processed" className="rounded-lg shadow-xl" />}
    </div>
  );
};

export default DisplayImage;