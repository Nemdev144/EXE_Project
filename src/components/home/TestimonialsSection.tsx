import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
    id: number;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    tourTitle?: string;
    createdAt: string;
}

interface TestimonialsSectionProps {
    testimonials?: Testimonial[];
}

// Sample testimonials if none provided
const sampleTestimonials: Testimonial[] = [
    {
        id: 1,
        userName: 'Hải Nguyên Yên',
        rating: 5,
        comment: 'I was pleasantly surprised by how it felt to be in Vietnam. It was the most Mother\'s Day the year and we are really blessed to attend the best traditional spring events...',
        tourTitle: 'Lễ hội Cồng Chiêng',
        createdAt: '2025-01-15',
    },
    {
        id: 2,
        userName: 'Hải Nguyên Yến',
        rating: 5,
        comment: 'I was pleasantly surprised by how it felt to be in Vietnam. It was the most memorable trip. The craftsmanship of local artisans is truly amazing...',
        tourTitle: 'Nghề gốm Bàu Trúc',
        createdAt: '2025-01-10',
    },
    {
        id: 3,
        userName: 'Hải Nguyên Tâm',
        rating: 5,
        comment: 'I was pleasantly surprised by how it felt to be in Vietnam. The cultural experience was beyond my expectations. I would definitely recommend this to everyone...',
        tourTitle: 'Cà phê Buôn Ma Thuột',
        createdAt: '2025-01-05',
    },
];

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const reviews = testimonials?.length ? testimonials : sampleTestimonials;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    // Get visible testimonials (show 3 at a time on desktop)
    const getVisibleTestimonials = () => {
        const items = [];
        for (let i = 0; i < Math.min(3, reviews.length); i++) {
            const index = (currentIndex + i) % reviews.length;
            items.push({ ...reviews[index], displayIndex: i });
        }
        return items;
    };

    return (
        <section className="py-20 md:py-32 bg-[var(--color-bg-alt)]">
            <div className="container">
                {/* Testimonial Cards */}
                <div className="relative">
                    <div className="grid md:grid-cols-3 gap-10">
                        {getVisibleTestimonials().map((review, idx) => (
                            <div
                                key={`${review.id}-${idx}`}
                                className="bg-white rounded-2xl p-10 shadow-md animate-fade-in"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Quote Icon */}
                                <Quote className="w-10 h-10 text-[var(--color-primary)]/20 mb-4" />

                                {/* User Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
                                        {review.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{review.userName}</h4>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating
                                                        ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Comment */}
                                <p className="text-[var(--color-text-light)] text-sm leading-relaxed line-clamp-4">
                                    {review.comment}
                                </p>

                                {/* Tour Tag */}
                                {review.tourTitle && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-xs text-[var(--color-text-muted)]">
                                            Đã tham gia:{' '}
                                            <span className="text-[var(--color-primary)] font-medium">
                                                {review.tourTitle}
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center items-center gap-6 mt-12">
                        <button
                            onClick={prevSlide}
                            className="w-14 h-14 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-7 h-7" />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-3">
                            {reviews.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex
                                            ? 'bg-[var(--color-primary)]'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to testimonial ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="w-14 h-14 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
