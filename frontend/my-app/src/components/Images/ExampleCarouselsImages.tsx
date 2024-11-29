// ExampleCarouselsImages.tsx
import React from 'react';

type ExampleCarouselsImagesProps = {
  imageUrl: string;
  altText: string;
};

const ExampleCarouselsImages: React.FC<ExampleCarouselsImagesProps> = ({ imageUrl, altText }) => {
  return (
    <div style={styles.imageContainer}>
      <img src={imageUrl} alt={altText} style={styles.image} />
    </div>
  );
};

// Styles
const styles = {
  imageContainer: {
    width: '100%',
    height: '400px', // Hauteur fixe pour éviter les variations
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ajuste l'image pour remplir le conteneur
  }
};

export default ExampleCarouselsImages;
