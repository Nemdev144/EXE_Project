import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Search, Star, Clock, Users, ArrowRight } from 'lucide-react';
import { tourService, provinceService } from '../services/api';
import type { Tour, Province } from '../types';

// Sample tours data for fallback
const sampleTours: Tour[] = [
    {
        id: 1,
        provinceId: 1,
        provinceName: 'Đắk Lắk',
        title: 'Rừng thông và thác nước Măng Đen',
        slug: 'rung-thong-mang-den',
        description: 'Khám phá vẻ đẹp hùng vĩ của thiên nhiên và nét văn hóa đặc đào đa mình giữa những rừng thông bạt ngàn cùng những thác nước.',
        durationHours: 4,
        maxParticipants: 15,
        price: 2500000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        images: [],
        averageRating: 4.8,
        totalReviews: 45,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
    },
    {
        id: 2,
        provinceId: 2,
        provinceName: 'Kon Tum',
        title: 'Nhà rông và làng cổ Kon Tum',
        slug: 'nha-rong-kon-tum',
        description: 'Khám phá vẻ đẹp hùng vĩ của thiên nhiên và nét văn hóa đặc đào đa mình giữa những rừng thông bạt ngàn cùng những thác nước.',
        durationHours: 3,
        maxParticipants: 10,
        price: 1800000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400',
        images: [],
        averageRating: 4.9,
        totalReviews: 67,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
    },
    {
        id: 3,
        provinceId: 1,
        provinceName: 'Đắk Lắk',
        title: 'Cồng Chiêng và cà phê Đắk Lắk',
        slug: 'cong-chieng-ca-phe',
        description: 'Khám phá vẻ đẹp hùng vĩ của thiên nhiên và nét văn hóa đặc đào đa mình giữa những rừng thông bạt ngàn cùng những thác nước.',
        durationHours: 5,
        maxParticipants: 12,
        price: 3200000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        images: [],
        averageRating: 4.7,
        totalReviews: 34,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
    },
    {
        id: 4,
        provinceId: 3,
        provinceName: 'Gia Lai',
        title: 'Rừng thông và thác nước Măng Đen',
        slug: 'rung-thong-mang-den-2',
        description: 'Khám phá vẻ đẹp hùng vĩ của thiên nhiên và nét văn hóa đặc đào đa mình giữa những rừng thông bạt ngàn cùng những thác nước.',
        durationHours: 4,
        maxParticipants: 20,
        price: 2500000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
        images: [],
        averageRating: 4.6,
        totalReviews: 28,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
    },
    {
        id: 5,
        provinceId: 2,
        provinceName: 'Kon Tum',
        title: 'Nhà rông và làng cổ Kon Tum',
        slug: 'nha-rong-kon-tum-2',
        description: 'Khám phá vẻ đẹp hùng vĩ của thiên nhiên và nét văn hóa đặc đào đa mình giữa những rừng thông bạt ngàn cùng những thác nước.',
        durationHours: 3,
        maxParticipants: 10,
        price: 1600000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
        images: [],
        averageRating: 4.5,
        totalReviews: 52,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
    },
    {
        id: 6,
        provinceId: 1,
        provinceName: 'Đắk Lắk',
        title: 'Cồng Chiêng và cà phê Đắk Lắk',
        slug: 'cong-chieng-ca-phe-2',
        description: 'Khám phá vẻ đẹp hùng vĩ của thiên nhiên và nét văn hóa đặc đào đa mình giữa những rừng thông bạt ngàn cùng những thác nước.',
        durationHours: 5,
        maxParticipants: 12,
        price: 3200000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400',
        images: [],
        averageRating: 4.8,
        totalReviews: 41,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
    },
];

const sampleProvinces: Province[] = [
    { id: 1, name: 'Đắk Lắk', slug: 'dak-lak', region: 'Tây Nguyên', latitude: 12.68, longitude: 108.04, description: '', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
    { id: 2, name: 'Kon Tum', slug: 'kon-tum', region: 'Tây Nguyên', latitude: 14.35, longitude: 108.00, description: '', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
    { id: 3, name: 'Gia Lai', slug: 'gia-lai', region: 'Tây Nguyên', latitude: 13.81, longitude: 108.11, description: '', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
    { id: 4, name: 'Đắk Nông', slug: 'dak-nong', region: 'Tây Nguyên', latitude: 12.00, longitude: 107.69, description: '', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
    { id: 5, name: 'Lâm Đồng', slug: 'lam-dong', region: 'Tây Nguyên', latitude: 11.95, longitude: 108.44, description: '', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
];

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch provinces
                const provincesData = await provinceService.getProvinces();
                setProvinces(provincesData);
            } catch (error) {
                console.error('Error fetching provinces:', error);
                setProvinces(sampleProvinces);
            }

            try {
                // Fetch tours
                const toursData = await tourService.getTours({
                    provinceId: selectedProvinceId || undefined,
                    limit: 20,
                });
                setTours(toursData.tours || []);
            } catch (error) {
                console.error('Error fetching tours:', error);
                // Use sample data as fallback
                if (selectedProvinceId) {
                    setTours(sampleTours.filter(t => t.provinceId === selectedProvinceId));
                } else {
                    setTours(sampleTours);
                }
            }

            setLoading(false);
        }

        fetchData();
    }, [selectedProvinceId]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'VND';
    };

    const handleSearch = () => {
        // Re-fetch with current filters
        setLoading(true);
        tourService.getTours({
            provinceId: selectedProvinceId || undefined,
            limit: 20,
        }).then(data => {
            setTours(data.tours || []);
            setLoading(false);
        }).catch(() => {
            if (selectedProvinceId) {
                setTours(sampleTours.filter(t => t.provinceId === selectedProvinceId));
            } else {
                setTours(sampleTours);
            }
            setLoading(false);
        });
    };

    const displayedTours = tours.length > 0 ? tours : sampleTours;

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[450px] overflow-hidden">
                {/* Background with silhouettes */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4A574] via-[#C8956E] to-[#8B4513]">
                    {/* Cultural silhouettes overlay */}
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Cpath d='M200 350 L180 280 L160 350 L140 300 L120 350 L100 320 L80 350 M400 350 L380 250 L360 350 M600 350 L580 200 L560 350 L540 280 L520 350 M800 350 L780 220 L760 350 L740 290 L720 350 M1000 350 L980 240 L960 350 L940 300 L920 350' stroke='%23000' fill='none' stroke-width='3'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'repeat-x',
                            backgroundPosition: 'bottom',
                        }}
                    />
                </div>

                {/* Content */}
                <div className="container relative h-full flex flex-col items-center justify-center text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                        KHÁM PHÁ VĂN HOÁ TÂY NGUYÊN
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl max-w-3xl mb-8 leading-relaxed">
                        Hành trình phẩm phả nên văn hoá đặc đảo của người dân tộc thiêu số với những
                        truyền thống lâu đời và cảnh quan thiên nhiên hùng vĩ
                    </p>
                    <Link
                        to="#tours"
                        className="btn bg-[var(--color-primary)] text-white px-10 py-4 rounded-full font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg"
                    >
                        Khám phá ngay
                    </Link>
                </div>
            </section>

            {/* Search/Filter Bar */}
            <section className="py-10 bg-white">
                <div className="container">
                    <div className="bg-white rounded-2xl shadow-lg p-6 -mt-20 relative z-10 border border-gray-100">
                        <div className="grid md:grid-cols-4 gap-6">
                            {/* Province Filter */}
                            <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
                                <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-500 mb-1">Địa điểm muốn đến</label>
                                    <select
                                        value={selectedProvinceId || ''}
                                        onChange={(e) => setSelectedProvinceId(e.target.value ? Number(e.target.value) : null)}
                                        className="w-full text-gray-800 font-medium bg-transparent focus:outline-none cursor-pointer"
                                    >
                                        <option value="">Tất cả tỉnh</option>
                                        {provinces.map((province) => (
                                            <option key={province.id} value={province.id}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Start Date */}
                            <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
                                <Calendar className="w-6 h-6 text-[var(--color-primary)]" />
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-500 mb-1">Thời gian đi</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full text-gray-800 font-medium bg-transparent focus:outline-none"
                                        placeholder="DD/MM/YYYY"
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
                                <Calendar className="w-6 h-6 text-[var(--color-primary)]" />
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-500 mb-1">Thời gian về</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full text-gray-800 font-medium bg-transparent focus:outline-none"
                                        placeholder="DD/MM/YYYY"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="flex items-center">
                                <button
                                    onClick={handleSearch}
                                    className="w-full bg-[var(--color-primary)] text-white py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors"
                                >
                                    <Search className="w-5 h-5" />
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tours List Section */}
            <section id="tours" className="py-16 md:py-24 bg-[var(--color-bg)]">
                <div className="container">
                    {/* Section Header */}
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4 tracking-wide">
                            TOUR NỔI BẬT
                        </h2>
                        {selectedProvinceId && (
                            <p className="text-[var(--color-text-light)]">
                                Đang hiển thị tours tại {provinces.find(p => p.id === selectedProvinceId)?.name}
                            </p>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent"></div>
                        </div>
                    ) : (
                        <>
                            {/* Tours Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayedTours.map((tour, index) => (
                                    <div
                                        key={tour.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {/* Tour Image */}
                                        <div className="relative h-52 overflow-hidden">
                                            <img
                                                src={tour.thumbnailUrl || `https://picsum.photos/400/300?random=${tour.id}`}
                                                alt={tour.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Province Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                                                    {tour.provinceName || 'Tây Nguyên'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tour Content */}
                                        <div className="p-6">
                                            <h3 className="font-bold text-lg text-[var(--color-primary)] mb-2 line-clamp-2 min-h-[3.5rem]">
                                                {tour.title}
                                            </h3>

                                            <p className="text-sm text-[var(--color-text-light)] mb-4 line-clamp-3">
                                                {tour.description}
                                            </p>

                                            {/* Tour Meta */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{tour.durationHours}h</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>Tối đa {tour.maxParticipants}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span>{tour.averageRating?.toFixed(1) || '4.5'}</span>
                                                </div>
                                            </div>

                                            {/* Price & CTA */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <span className="text-xl font-bold text-[var(--color-primary)]">
                                                    {formatPrice(tour.price)}
                                                </span>
                                                <Link
                                                    to={`/tours/${tour.id}`}
                                                    className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
                                                >
                                                    Đặt ngay
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            <div className="text-center mt-14">
                                <button className="inline-flex items-center gap-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 py-4 rounded-full font-bold hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                                    Xem tất cả
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
