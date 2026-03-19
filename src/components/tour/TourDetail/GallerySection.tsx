import type { Tour } from '../../../types';
import { parseImages } from './utils';

interface GallerySectionProps {
  tour: Tour;
  cultureItems?: { thumbnailUrl?: string; title?: string }[];
}

export default function GallerySection({ tour, cultureItems = [] }: GallerySectionProps) {
  const tourImages = parseImages(tour.images);
  const tourList = tourImages.length > 0 ? tourImages : [tour.thumbnailUrl || '/nen.png'];
  const cultureUrls = cultureItems.map((c) => c.thumbnailUrl || '/nen.png').filter(Boolean);
  const displayImages = [...tourList, ...cultureUrls].slice(0, 3);

  if (displayImages.length === 0) return null;

  return (
    <div className="td-gallery">
      <h3 className="td-gallery__title">Gallery</h3>
      <div className="td-gallery__grid">
        {displayImages.map((src, i) => (
          <img key={i} src={src} alt={`${tour.title} ${i + 1}`} className="td-gallery__img" />
        ))}
      </div>
    </div>
  );
}
