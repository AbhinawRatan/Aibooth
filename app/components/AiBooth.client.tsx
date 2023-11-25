import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaCamera } from 'react-icons/fa';
import { storage } from '../../pages/api/firebaseConfig'; // Adjust path as needed
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

interface FormInputs {
  prompt: string;
}

const AiBoothComponent: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImage(imageSrc || '');
  };

  const uploadImage = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const fetchResponse = await fetch(image);
      const blob = await fetchResponse.blob();
      const imageFile = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
      const imageRef = storageRef(storage, `images/${imageFile.name}`);
      const uploadResult = await uploadBytes(imageRef, imageFile);
      const url = await getDownloadURL(uploadResult.ref);
      setImageUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!imageUrl) return;

    setLoading(true);
    try {
      const response = await fetch('/api/imageProcess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl, prompt: data.prompt }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setProcessedImageUrl(responseData.output.output_images[0]);
    } catch (error) {
      console.error('There was a problem with the operation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      className="w-full max-w-lg rounded-lg shadow-md mb-4"
    />
    <button onClick={capture} className="glassmorphism text-white font-bold py-2 px-4 rounded mb-4">
      <FaCamera size="24px" /> 
    </button>
    {image && (
      <>
        <img src={image} alt="Captured" className="w-full max-w-lg rounded-lg shadow-md mb-4" />
        <button 
          onClick={uploadImage} 
          className="glassmorphism text-white font-bold py-2 px-4 rounded mb-4"
          disabled={loading}
        >
          ✨ Ai Magic
        </button>
      </>
    )}
    {imageUrl && (
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs mb-4">
        <input 
          {...register('prompt', { required: true })}
          className="shadow appearance-none border rounded w-full py-4 px-4 mb-6 leading-tight focus:outline-none focus:shadow-outline text-black"
          placeholder="Enter your prompt"
          disabled={loading}
        />
        {errors.prompt && <span className="text-red-500 text-xs italic ">This field is required</span>}
        <input 
          type="submit" 
          className="glassmorphism text-white font-bold py-2 px-4 rounded "
          disabled={loading}
        />
      </form>
    )}
    {loading && <p>Loading...</p>}
    {processedImageUrl && (
      <div className="mt-4">
      <h2 className="text-xl font-bold mb-2 text-center">Processed Image</h2>
      <img src={processedImageUrl} alt="Processed" className="w-full max-w-lg rounded-lg shadow-md mx-auto" />
      <div className="flex justify-center mt-4">
        <a 
          href={processedImageUrl} 
          download="processed-image.jpg"
          className="glassmorphism text-white font-bold py-2 px-4 rounded"
        >
          Download Image
        </a>
      </div>
    </div>
    )}
  </div>
);
};

export default AiBoothComponent;
