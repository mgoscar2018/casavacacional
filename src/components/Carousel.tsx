
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const TIME_RUNNING = 3000;
const TIME_AUTO_NEXT = 7000;

interface Slide {
  id: string;
  imageSrc: string;
  author: string;
  title: string;
  topic: string;
  des: string;
  thumbSrc: string;
  thumbTitle: string;
  thumbDesc: string;
  dataAiHint: string;
}

const loremIpsum = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?";

const initialSlidesData: Slide[] = [
  { id: '1', imageSrc: '/images/carousel/img1.webp', author: 'LUNDEV', title: 'DESIGN SLIDER', topic: 'PLAYA', des: loremIpsum, thumbSrc: '/images/carousel/img1.webp', thumbTitle: 'Name Slider', thumbDesc: 'Description', dataAiHint: 'beach house' },
  { id: '2', imageSrc: '/images/carousel/img2.webp', author: 'LUNDEV', title: 'DESIGN SLIDER', topic: 'MONTAÑA', des: loremIpsum, thumbSrc: '/images/carousel/img2.webp', thumbTitle: 'Name Slider', thumbDesc: 'Description', dataAiHint: 'mountain cabin' },
  { id: '3', imageSrc: '/images/carousel/img3.webp', author: 'LUNDEV', title: 'DESIGN SLIDER', topic: 'CIUDAD', des: loremIpsum, thumbSrc: '/images/carousel/img3.webp', thumbTitle: 'Name Slider', thumbDesc: 'Description', dataAiHint: 'city apartment' },
  { id: '4', imageSrc: '/images/carousel/img4.webp', author: 'LUNDEV', title: 'DESIGN SLIDER', topic: 'CAMPO', des: loremIpsum, thumbSrc: '/images/carousel/img4.webp', thumbTitle: 'Name Slider', thumbDesc: 'Description', dataAiHint: 'countryside farm' },
];

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  dataAiHint: string;
  isThumb?: boolean;
  priority?: boolean;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, width, height, className, dataAiHint, isThumb = false, priority = false }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false); // Reset error state if src changes
  }, [src]);

  if (error) {
    const style: React.CSSProperties = {
      width: '100%',
      height: '100%',
      backgroundColor: '#333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: 'white',
      fontSize: '10px',
      boxSizing: 'border-box',
      padding: '5px',
      textAlign: 'center',
    };
    if (isThumb) {
      style.borderRadius = '20px';
    }
    return (
      <div style={style} className={className}>
        <span>{src.split('/').pop()}</span>
        <span>({width}x{height})</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      data-ai-hint={dataAiHint}
      priority={priority}
      unoptimized={src.startsWith('https://placehold.co')} // No need to optimize placeholders
    />
  );
};


const Carousel: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(initialSlidesData);
  const [action, setAction] = useState<'next' | 'prev' | null>(null);
  const runTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const runNextAutoRef = useRef<NodeJS.Timeout | null>(null);

  const showSlider = useCallback((type: 'next' | 'prev') => {
    setSlides(prevSlides => {
      if (type === 'next') {
        const [first, ...rest] = prevSlides;
        return [...rest, first];
      } else {
        const last = prevSlides[prevSlides.length - 1];
        const rest = prevSlides.slice(0, prevSlides.length - 1);
        return [last, ...rest];
      }
    });
    setAction(type);

    if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
    runTimeoutRef.current = setTimeout(() => {
      setAction(null);
    }, TIME_RUNNING);
  }, []);

  const handleNext = useCallback(() => {
    if (action) return; // Prevent multiple clicks while animation is running
    showSlider('next');
  }, [showSlider, action]);

  const handlePrev = useCallback(() => {
    if (action) return; // Prevent multiple clicks while animation is running
    showSlider('prev');
  }, [showSlider, action]);

  useEffect(() => {
    if (runNextAutoRef.current) clearTimeout(runNextAutoRef.current);
    runNextAutoRef.current = setTimeout(() => {
      handleNext();
    }, TIME_AUTO_NEXT);

    return () => {
      if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
      if (runNextAutoRef.current) clearTimeout(runNextAutoRef.current);
    };
  }, [slides, handleNext]);

  const orderedThumbnails = slides.length > 1 ? [...slides.slice(1), slides[0]] : slides;

  return (
    <div className={`carousel ${action ? action : ''}`}>
      <div className="list">
        {slides.map((slide, index) => (
          <div
            className="item"
            key={slide.id}
            style={{ zIndex: index === 0 ? 1 : (action && index === 1 && action === 'prev' ? 2 : 0) }}
          >
            <ImageWithFallback
              src={slide.imageSrc}
              alt={`Slide ${slide.id} - ${slide.topic}`}
              width={1920} 
              height={1080}
              dataAiHint={slide.dataAiHint}
              priority={slide.id === initialSlidesData[0].id && !action} // Priority for the very first image loaded
            />
            <div className="content">
              <div className="author">{slide.author}</div>
              <div className="title">{slide.title}</div>
              <div className="topic">{slide.topic}</div>
              <div className="des">{slide.des}</div>
              <div className="buttons">
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="thumbnail">
        {orderedThumbnails.map((slide) => (
          <div className="item" key={`thumb-${slide.id}`}>
            <ImageWithFallback
              src={slide.thumbSrc}
              alt={`Thumbnail ${slide.id} - ${slide.topic}`}
              width={150}
              height={220}
              isThumb={true}
              dataAiHint={slide.dataAiHint}
            />
            <div className="content">
              <div className="title">{slide.thumbTitle}</div>
              <div className="description">{slide.thumbDesc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="arrows">
        <button id="prev" onClick={handlePrev} disabled={!!action}>&lt;</button>
        <button id="next" onClick={handleNext} disabled={!!action}>&gt;</button>
      </div>

      <div className="time"></div>
    </div>
  );
};

export default Carousel;

    