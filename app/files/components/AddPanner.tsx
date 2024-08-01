import React, { useState, useEffect, useRef } from 'react';

interface AdImage {
  id: number;
  url: string;
}

const AdBanner: React.FC = () => {
  const [images, setImages] = useState<AdImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fetch initial set of images (assuming you have some API endpoint to get image metadata)
    const fetchInitialImages = async () => {
      setImages([{id:1,url:"/eclLogo.png"}])
    };

    fetchInitialImages();
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const fetchImage = async (index: number) => {
    if (images[index].url) return; // Skip if already fetched

    setLoading(true);
    const response = await fetch(`/api/ad/${images[index].id}`);
    const data = await response.json();
    setLoading(false);

    setImages((prevImages) =>
      prevImages.map((image, idx) =>
        idx === index ? { ...image, url: data.url } : image
      )
    );
  };

  useEffect(() => {
    if (images.length > 0) {
      fetchImage(currentIndex);
    }
  }, [currentIndex, images]);

  return (
    <>
    <div className="relative w-full max-w-xl mx-auto bg-gray-200 rounded-md overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      ) : (
        images[currentIndex]?.url && (
          <img
            src={images[currentIndex].url}
            alt={`Ad ${currentIndex + 1}`}
            className="w-full h-64 object-cover"
          />
        )
      )}
      <button
        onClick={handlePrevClick}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full"
      >
        &#9664;
      </button>
      <button
        onClick={handleNextClick}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full"
      >
        &#9654;
      </button>
    </div>
    </>
  );
};

export default AdBanner;