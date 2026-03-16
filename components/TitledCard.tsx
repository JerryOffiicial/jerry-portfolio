import type { SpringOptions } from 'motion/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

interface TiltedCardProps {
  /** Single image (backward compatible) */
  imageSrc?: React.ComponentProps<'img'>['src'];
  /** Array of images for gallery mode */
  images?: string[];
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  /** Auto-rotate interval in ms (0 = disabled) */
  autoRotateInterval?: number;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  imageSrc,
  images,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  autoRotateInterval = 4000
}: TiltedCardProps) {
  // Resolve image list: prefer `images` array, fall back to single `imageSrc`
  const imageList = images && images.length > 0
    ? images
    : imageSrc
      ? [imageSrc]
      : [];

  const isGallery = imageList.length > 1;

  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Auto-rotation
  useEffect(() => {
    if (!isGallery || isHovered || autoRotateInterval <= 0) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [isGallery, isHovered, autoRotateInterval, imageList.length]);

  const goTo = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  }, [imageList.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  }, [imageList.length]);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
    setIsHovered(true);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
    setIsHovered(false);
  }

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale
        }}
      >
        {/* Image(s) with gallery crossfade */}
        <div
          className="absolute top-0 left-0 overflow-hidden rounded-[15px]"
          style={{ width: imageWidth, height: imageHeight }}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={currentIndex}
              src={imageList[currentIndex]}
              alt={`${altText} ${isGallery ? currentIndex + 1 : ''}`}
              className="absolute top-0 left-0 object-cover will-change-transform"
              style={{
                width: imageWidth,
                height: imageHeight
              }}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'tween', duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.3 }
              }}
            />
          </AnimatePresence>
        </div>

        {/* Overlay content */}
        {displayOverlayContent && overlayContent && (
          <motion.div className="absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]">
            {overlayContent}
          </motion.div>
        )}

      </motion.div>

      {/* Gallery navigation — OUTSIDE motion.div, directly in figure */}
      {isGallery && (
        <>
          <div
            className="absolute inset-0 z-[50] flex items-center justify-between px-2 transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? 'auto' : 'none' }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white hover:bg-black/70 transition-colors duration-200 cursor-pointer"
              aria-label="Previous image"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white hover:bg-black/70 transition-colors duration-200 cursor-pointer"
              aria-label="Next image"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[50] flex items-center gap-1.5">
            {imageList.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); goTo(idx); }}
                className="cursor-pointer transition-all duration-300"
                aria-label={`Go to image ${idx + 1}`}
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: idx === currentIndex ? 16 : 6,
                    height: 6,
                    background: idx === currentIndex ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
                    boxShadow: idx === currentIndex ? '0 0 6px rgba(255,255,255,0.5)' : 'none',
                  }}
                />
              </button>
            ))}
          </div>
        </>
      )}

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
