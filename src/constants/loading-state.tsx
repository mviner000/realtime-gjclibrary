"use client"

import { useEffect, useState } from 'react';
import { FidgetSpinner } from 'react-loader-spinner';

const DelayedLoadingState = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // adjust the delay time as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <FidgetSpinner
          visible={true}
          height="80"
          width="80"
          ariaLabel="loading"
          wrapperStyle={{}}
          wrapperClass=""
          ballColors={['#ff0000', '#00ff00', '#0000ff']}
        />
      </div>
    );
  } else {
    return null; // or some other fallback component
  }
};

export { DelayedLoadingState as LoadingState };