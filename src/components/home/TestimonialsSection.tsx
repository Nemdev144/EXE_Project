'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Review } from '../../types';
import { getTourReviews } from '../../services/api';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerView = 3;

  useEffect(() => {
    let mounted = true;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('[TestimonialsSection] 🚀 Fetching reviews for tours 1, 2, 3, 4...');
        const tourIds = [1, 2, 3, 4];

        const results = await Promise.all(
          tourIds.map((tourId) =>
            getTourReviews(tourId).catch((err) => {
              console.error(`[TestimonialsSection] ❌ Reviews error for tour ${tourId}:`, err);
              return [];
            })
          )
        );

        if (!mounted) return;
        const merged = results.flat();
        const uniqueMap = new Map<number, Review>();
        merged.forEach((review) => {
          uniqueMap.set(review.id, review);
        });
        const list = Array.from(uniqueMap.values());

        console.log('[TestimonialsSection] ✅ Reviews received:', {
          tours: tourIds.length,
          reviews: list.length,
          reviewsData: list,
        });
        setReviews(list);
      } catch (err) {
        if (!mounted) return;
        console.error('[TestimonialsSection] ❌ API error:', err);
        setError('Không thể tải dữ liệu đánh giá');
      } finally {
        if (mounted) {
          console.log('[TestimonialsSection] 🏁 Fetch completed');
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      mounted = false;
    };
  }, []);

  const displayTestimonials = useMemo(() => reviews, [reviews]);

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

  const getInitials = (name?: string) => {
    if (!name) return 'KH';
    const parts = name.trim().split(/\s+/);
    return parts.slice(-2).map((part) => part[0]).join('').toUpperCase();
  };

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

        {loading && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-light)] text-lg">Đang tải dữ liệu...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-light)] text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && displayTestimonials.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-light)] text-lg">Chưa có dữ liệu đánh giá</p>
          </div>
        )}

        {!loading && !error && displayTestimonials.length > 0 && (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visibleTestimonials.map((testimonial, idx) => (
                <div
                  key={`${testimonial.id}-${currentIndex}-${idx}`}
                  className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {testimonial.userAvatar ? (
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
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full bg-gray-300 text-white flex items-center justify-center font-semibold"
                        aria-label={`Avatar of ${testimonial.userName}`}
                      >
                        {getInitials(testimonial.userName)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--color-text)]">
                        {testimonial.userName || 'Khách hàng'}
                      </p>
                      <p className="text-xs text-[var(--color-text-light)]">
                        Khách hàng
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-3">{renderStars(testimonial.rating || 0)}</div>

                  <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                    {testimonial.comment}
                  </p>
                </div>
              ))}
            </div>

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
        )}

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
/*
 import { getPublicTours, getTourReviews } from '../../services/api';
 import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

 export default function TestimonialsSection() {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [reviews, setReviews] = useState<Review[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const itemsPerView = 3;

   useEffect(() => {
     let mounted = true;

     const fetchReviews = async () => {
       setLoading(true);
       setError(null);
       try {
         console.log('[TestimonialsSection] 🚀 Fetching tours and reviews...');
         const tours = await getPublicTours();
         const tourIds = tours.map((tour) => tour.id);

         if (tourIds.length === 0) {
           if (mounted) {
             setReviews([]);
           }
           return;
         }

         const results = await Promise.all(
           tourIds.map((tourId) =>
             getTourReviews(tourId).catch((err) => {
               console.error(`[TestimonialsSection] ❌ Reviews error for tour ${tourId}:`, err);
               return [];
             })
           )
         );

         if (!mounted) return;
         const merged = results.flat().filter((review) => review.status === 'VISIBLE');
         const uniqueMap = new Map<number, Review>();
         merged.forEach((review) => {
           uniqueMap.set(review.id, review);
         });
         const list = Array.from(uniqueMap.values());

         console.log('[TestimonialsSection] ✅ Reviews received:', {
           tours: tourIds.length,
           reviews: list.length,
         });
         setReviews(list);
       } catch (err) {
         if (!mounted) return;
         console.error('[TestimonialsSection] ❌ API error:', err);
         setError('Không thể tải dữ liệu đánh giá');
       } finally {
         if (mounted) {
           console.log('[TestimonialsSection] 🏁 Fetch completed');
           setLoading(false);
         }
       }
     };

     fetchReviews();

     return () => {
       mounted = false;
     };
   }, []);

   const displayTestimonials = useMemo(() => reviews, [reviews]);

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

   const getInitials = (name?: string) => {
     if (!name) return 'KH';
     const parts = name.trim().split(/\s+/);
     return parts.slice(-2).map((part) => part[0]).join('').toUpperCase();
   };

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

         {loading && (
           <div className="text-center py-16">
             <p className="text-[var(--color-text-light)] text-lg">Đang tải dữ liệu...</p>
           </div>
         )}

         {!loading && error && (
           <div className="text-center py-16">
             <p className="text-[var(--color-text-light)] text-lg">{error}</p>
           </div>
         )}

         {!loading && !error && displayTestimonials.length === 0 && (
           <div className="text-center py-16">
             <p className="text-[var(--color-text-light)] text-lg">Chưa có dữ liệu đánh giá</p>
           </div>
         )}

         {!loading && !error && displayTestimonials.length > 0 && (
           <div className="relative">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {visibleTestimonials.map((testimonial, idx) => (
                 <div
                   key={`${testimonial.id}-${currentIndex}-${idx}`}
                   className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                 >
                   <div className="flex items-center gap-3 mb-4">
                     {testimonial.userAvatar ? (
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
                     ) : (
                       <div
                         className="w-12 h-12 rounded-full bg-gray-300 text-white flex items-center justify-center font-semibold"
                         aria-label={`Avatar of ${testimonial.userName}`}
                       >
                         {getInitials(testimonial.userName)}
                       </div>
                     )}
                     <div className="flex-1 min-w-0">
                       <p className="font-semibold text-[var(--color-text)]">
                         {testimonial.userName || 'Khách hàng'}
                       </p>
                       <p className="text-xs text-[var(--color-text-light)]">
                         Khách hàng
                       </p>
                     </div>
                   </div>

                   <div className="flex gap-1 mb-3">{renderStars(testimonial.rating || 0)}</div>

                   <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                     {testimonial.comment}
                   </p>
                 </div>
               ))}
             </div>

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
         )}

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

        {/* Carousel * /}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial, idx) => (
              <div
                key={`${testimonial.id}-${currentIndex}-${idx}`}
                className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* User Info * /}
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

                {/* Rating * /}
                <div className="flex gap-1 mb-3">{renderStars(testimonial.rating || 5)}</div>

                {/* Content * /}
                <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                  {testimonial.description}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons * /}
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

        {/* Indicators * /}
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
*/
