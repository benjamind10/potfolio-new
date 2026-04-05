import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CarouselImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const prev = () => {
    setDirection(-1);
    setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setDirection(1);
    setIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [modalOpen]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full overflow-hidden rounded border border-gray-300 shadow dark:border-gray-700">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={index}
            src={images[index].src}
            alt={images[index].alt}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full object-contain cursor-zoom-in"
            onClick={() => setModalOpen(true)}
          />
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-indigo-600"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-indigo-600"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <span className="text-sm text-gray-500 dark:text-gray-400">
        {index + 1} / {images.length}
      </span>
      {modalOpen && typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key="lightbox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
              onClick={() => setModalOpen(false)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setModalOpen(false); }}
                className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white transition hover:bg-indigo-600"
              >
                <X size={24} />
              </button>

              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-indigo-600"
              >
                <ChevronLeft size={28} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-indigo-600"
              >
                <ChevronRight size={28} />
              </button>

              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={index}
                  src={images[index].src}
                  alt={images[index].alt}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-300">
                {index + 1} / {images.length}
              </span>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};

export default ImageCarousel;
