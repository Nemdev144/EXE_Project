'use client';

import { useState } from 'react';
import type { UserMemory } from '../../types';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials?: UserMemory[];
}

export default function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;

  // Default testimonials if none provided
  const defaultTestimonials: (UserMemory & { rating?: number; userAvatar?: string })[] = [
    {
      id: 1,
      userId: 1,
      userName: 'Hai Nguyễn Văn',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      title: 'Trải nghiệm tuyệt vời',
      description:
        'I was given the gift of a workshop of Love in Fresh Flowers for Mother\'s Day this year and was lucky...',
      images: [],
      status: 'PUBLISHED',
      rating: 4.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: 2,
      userName: 'Minh Trần',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      title: 'Văn hóa độc đáo',
      description:
        'Một trải nghiệm tuyệt vời! Tôi đã học được rất nhiều về văn hóa Tây Nguyên...',
      images: [],
      status: 'PUBLISHED',
      rating: 4.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      userId: 3,
      userName: 'Lan Phạm',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      title: 'Tour chất lượng',
      description:
        'Tour rất tuyệt vời, hướng dẫn viên thân thiện và chuyên nghiệp...',
      images: [],
      status: 'PUBLISHED',
      rating: 4.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayTestimonials = testimonials.length > 0 
    ? testimonials.map(t => ({ ...t, rating: 5, userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${t.id}` }))
    : defaultTestimonials;

  const nextSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev + 1) % Math.max(1, displayTestimonials.length - itemsPerView + 1)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0
        ? Math.max(0, displayTestimonials.length - itemsPerView)
        : prev - 1
    );
  };

  const visibleTestimonials = displayTestimonials.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="section-container bg-gradient-to-b from-[var(--color-bg)] to-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">ĐÁNH GIÁ KHÁCH HÀNG</h2>
        <p className="section-subtitle">
          Những trải nghiệm tuyệt vời từ những du khách yêu thích Tây Nguyên
        </p>

        {/* Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial, idx) => (
              <div
                key={`${testimonial.id}-${currentIndex}-${idx}`}
                className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex-shrink-0"
                    style={{
                      backgroundImage: `url('${testimonial.userAvatar}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    role="img"
                    aria-label={`Avatar of ${testimonial.userName}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--color-text)]">
                      {testimonial.userName || 'Khách hàng'}
                    </p>
                    <p className="text-xs text-[var(--color-text-light)]">
                      Khách hàng
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-3">{renderStars(testimonial.rating || 5)}</div>

                {/* Content */}
                <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                  {testimonial.description}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {displayTestimonials.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-[var(--color-primary)] text-white p-3 rounded-full hover:bg-[var(--color-primary-dark)] transition-all"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-[var(--color-primary)] text-white p-3 rounded-full hover:bg-[var(--color-primary-dark)] transition-all"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Indicators */}
        {displayTestimonials.length > itemsPerView && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({
              length: Math.max(1, displayTestimonials.length - itemsPerView + 1),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-[var(--color-primary)]'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
