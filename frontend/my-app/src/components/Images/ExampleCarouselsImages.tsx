// ExampleCarouselsImages.jsx ou ExampleCarouselsImages.tsx
import React from 'react';

type ExampleCarouselsImagesProps = {
  text: string;
};

const ExampleCarouselsImages: React.FC<ExampleCarouselsImagesProps> = ({ text }) => {
  return (
    <div>
      <img src={`path/to/your/image/${text}.jpg`} alt={text} />
    </div>
  );
};

export default ExampleCarouselsImages;
