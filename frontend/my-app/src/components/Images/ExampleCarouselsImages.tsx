import React from "react";

type ExampleCarouselsImagesProps = {
  imageUrl: string;
  altText: string;
};

const ExampleCarouselsImages: React.FC<ExampleCarouselsImagesProps> = ({
  imageUrl,
  altText,
}) => {
  return (
    <div style={imageContainerStyle}>
      <img src={imageUrl} alt={altText} style={imageStyle} />
    </div>
  );
};

// Styles
const imageContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px", // Hauteur fixe pour éviter les variations
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover", // Ajuste l'image pour remplir le conteneur
};

export default ExampleCarouselsImages;
