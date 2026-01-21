import { Star, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tour } from '../../types';

interface TourExperienceSectionProps {
    tours: Tour[];
}

export default function TourExperienceSection({ tours }: TourExperienceSectionProps) {
    const displayedTours = tours.slice(0, 4);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <section className="py-20 md:py-32 bg-[var(--color-primary)]">
            <div className="container">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">
                        TOUR TRẢI NGHIỆM VĂN HOÁ
                    </h2>
                    <p className="text-white/80 max-w-2xl mx-auto">
                        Trải nghiệm văn hóa Tây Nguyên qua những chuyến đi đáng nhớ
                    </p>
                </div>

                {/* Tour Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {displayedTours.map((tour, index) => (
                        <div
                            key={tour.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Tour Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={tour.thumbnailUrl || `https://picsum.photos/400/300?random=${tour.id}`}
                                    alt={tour.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="badge">
                                        {tour.provinceName || 'Tây Nguyên'}
                                    </span>
                                </div>
                            </div>

                            {/* Tour Content */}
                            <div className="p-8">
                                <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                                    {tour.title}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                                        <span className="font-semibold text-sm">
                                            {tour.averageRating?.toFixed(1) || '4.5'}
                                        </span>
                                    </div>
                                    <span className="text-[var(--color-text-muted)] text-sm">
                                        ({tour.totalReviews || 0} đánh giá)
                                    </span>
                                </div>

                                {/* Tour Meta */}
                                <div className="flex items-center gap-4 text-sm text-[var(--color-text-light)] mb-4">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{tour.durationHours || 3}h</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>Tối đa {tour.maxParticipants || 10}</span>
                                    </div>
                                </div>

                                {/* Price & CTA */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        <span className="text-xl font-bold text-[var(--color-primary)]">
                                            {formatPrice(tour.price || 500000)}
                                        </span>
                                        <span className="text-sm text-[var(--color-text-muted)]">/người</span>
                                    </div>
                                    <Link
                                        to={`/tours/${tour.id}`}
                                        className="btn-primary px-8 py-4 text-base rounded-xl font-bold"
                                    >
                                        Đặt ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-14">
                    <Link
                        to="/tours"
                        className="inline-flex items-center gap-3 bg-white text-[var(--color-primary)] px-12 py-5 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-md"
                    >
                        Xem tất cả
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
