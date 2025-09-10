
import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: { url: string; name: string }[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  const handleNavigate = (delta: number) => {
    const newIndex = (currentIndex + delta + images.length) % images.length;
    onNavigate(newIndex);
  };

  const currentImage = images[currentIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentImage.name || `Image ${currentIndex + 1} of ${images.length}`}
    >
      <div className="relative">
        <img
          src={currentImage.url}
          alt={currentImage.name}
          className="max-h-[70vh] w-auto mx-auto rounded-md"
        />
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              onClick={() => handleNavigate(-1)}
              className="!absolute top-1/2 -translate-y-1/2 left-2 !p-2 rounded-full"
              aria-label="Previous image"
            >
              &lt;
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleNavigate(1)}
              className="!absolute top-1/2 -translate-y-1/2 right-2 !p-2 rounded-full"
              aria-label="Next image"
            >
              &gt;
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ImageLightbox;
