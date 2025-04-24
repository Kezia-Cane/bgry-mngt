import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../animations/loadingAnimation.json';
import './LoadingAnimation.css';

const LoadingAnimation = ({ size = 100 }) => {
  return (
    <div className="table-loading-animation">
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default LoadingAnimation;
