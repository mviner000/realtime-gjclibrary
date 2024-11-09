"use client";

import React, { useState } from 'react';
import TokenChecker from './auth/token';

const TokenStatus: React.FC = () => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  const handleTokenCheck = (hasToken: boolean) => {
    setHasToken(hasToken);
  };

  return (
    <div className='my-8'>
      <h1>TokenStatus</h1>
      <TokenChecker onTokenCheck={handleTokenCheck} />
      {hasToken === null ? (
        <p>Checking token...</p>
      ) : hasToken ? (
        <p>Token is available</p>
      ) : (
        <p>No token available</p>
      )}
    </div>
  );
};

export default TokenStatus;
