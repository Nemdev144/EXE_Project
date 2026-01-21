import { useState, useEffect } from 'react';
import {
    HeroSection,
    MapSection,
    TourExperienceSection,
    QuickLearnSection,
    TestimonialsSection,
} from '../components/home';
import { getHomePageData } from '../services/api';
import type { HomePageResponse } from '../types';

// Sample data for fallback
const sampleData: HomePageResponse = {
    provinces: [
        { id: 1, name: 'Đắk Lắk', slug: 'dak-lak', region: 'Tây Nguyên', latitude: 12.6795, longitude: 108.0377, description: 'Thủ phủ cà phê Việt Nam', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
        { id: 2, name: 'Gia Lai', slug: 'gia-lai', region: 'Tây Nguyên', latitude: 13.8078, longitude: 108.1094, description: 'Vùng đất đỏ bazan', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
        { id: 3, name: 'Kon Tum', slug: 'kon-tum', region: 'Tây Nguyên', latitude: 14.3496, longitude: 108.0004, description: 'Nơi ngã ba Đông Dương', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
        { id: 4, name: 'Đắk Nông', slug: 'dak-nong', region: 'Tây Nguyên', latitude: 12.0019, longitude: 107.6876, description: 'Công viên địa chất toàn cầu', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
        { id: 5, name: 'Lâm Đồng', slug: 'lam-dong', region: 'Tây Nguyên', latitude: 11.9463, longitude: 108.4419, description: 'Thành phố ngàn hoa', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
    ],
    featuredTours: [
        { id: 1, provinceId: 1, provinceName: 'Đắk Lắk', title: 'Lễ hội Cồng Chiêng - Gia Lai', slug: 'le-hoi-cong-chieng', description: '', durationHours: 4, maxParticipants: 15, price: 2500000, thumbnailUrl: '', images: [], averageRating: 4.8, totalReviews: 45, createdAt: '', updatedAt: '' },
        { id: 2, provinceId: 2, provinceName: 'Gia Lai', title: 'Hành trình cà phê - BMT', slug: 'hanh-trinh-ca-phe', description: '', durationHours: 3, maxParticipants: 10, price: 1800000, thumbnailUrl: '', images: [], averageRating: 4.9, totalReviews: 67, createdAt: '', updatedAt: '' },
        { id: 3, provinceId: 3, provinceName: 'Kon Tum', title: 'Khám phá làng nghề - Kon Tum', slug: 'kham-pha-lang-nghe', description: '', durationHours: 5, maxParticipants: 12, price: 3200000, thumbnailUrl: '', images: [], averageRating: 4.7, totalReviews: 34, createdAt: '', updatedAt: '' },
        { id: 4, provinceId: 1, provinceName: 'Đắk Lắk', title: 'Nhà rông và làng cổ Rừng Đen', slug: 'nha-rong-lang-co', description: '', durationHours: 4, maxParticipants: 20, price: 1500000, thumbnailUrl: '', images: [], averageRating: 4.6, totalReviews: 28, createdAt: '', updatedAt: '' },
    ],
    cultureItems: [
        { id: 1, provinceId: 1, provinceName: 'Đắk Lắk', category: 'FESTIVAL', title: 'Lễ hội Cồng Chiêng', description: 'Di sản văn hóa phi vật thể', thumbnailUrl: '', images: [], createdAt: '', updatedAt: '' },
        { id: 2, provinceId: 1, provinceName: 'Đắk Lắk', category: 'FOOD', title: 'Cà phê Buôn Ma Thuột', description: 'Thương hiệu cà phê nổi tiếng', thumbnailUrl: '', images: [], createdAt: '', updatedAt: '' },
        { id: 3, provinceId: 2, provinceName: 'Gia Lai', category: 'COSTUME', title: 'Trang phục truyền thống Ê-đê', description: 'Văn hóa trang phục độc đáo', thumbnailUrl: '', images: [], createdAt: '', updatedAt: '' },
        { id: 4, provinceId: 3, provinceName: 'Kon Tum', category: 'CRAFT', title: 'Nghề dệt thổ cẩm', description: 'Nghề truyền thống lâu đời', thumbnailUrl: '', images: [], createdAt: '', updatedAt: '' },
        { id: 5, provinceId: 4, provinceName: 'Đắk Nông', category: 'LEGEND', title: 'Truyền thuyết núi lửa', description: 'Câu chuyện về vùng đất', thumbnailUrl: '', images: [], createdAt: '', updatedAt: '' },
    ],
    artisans: [],
    blogPosts: [
        { id: 1, authorId: 1, title: '5 phút tìm hiểu về Cồng Chiêng', slug: '5-phut-tim-hieu-cong-chieng', content: 'Khám phá âm nhạc truyền thống của các dân tộc Tây Nguyên...', featuredImageUrl: '', status: 'PUBLISHED', viewCount: 1234, createdAt: '', updatedAt: '' },
        { id: 2, authorId: 1, title: 'Cách pha cà phê Buôn Ma Thuột', slug: 'cach-pha-ca-phe-bmt', content: 'Bí quyết pha cà phê đậm đà hương vị Tây Nguyên...', featuredImageUrl: '', status: 'PUBLISHED', viewCount: 2345, createdAt: '', updatedAt: '' },
        { id: 3, authorId: 1, title: 'Trang phục truyền thống Ê-đê', slug: 'trang-phuc-truyen-thong-e-de', content: 'Tìm hiểu về những họa tiết độc đáo trên trang phục...', featuredImageUrl: '', status: 'PUBLISHED', viewCount: 892, createdAt: '', updatedAt: '' },
    ],
    videos: [
        { id: 1, title: 'Lễ hội Cồng Chiêng 2024', videoUrl: '', thumbnailUrl: '', provinceName: 'Đắk Lắk', status: 'PUBLISHED', viewCount: 5678, createdAt: '', updatedAt: '' },
        { id: 2, title: 'Hành trình cà phê Tây Nguyên', videoUrl: '', thumbnailUrl: '', provinceName: 'Đắk Lắk', status: 'PUBLISHED', viewCount: 3456, createdAt: '', updatedAt: '' },
        { id: 3, title: 'Nghệ nhân dệt thổ cẩm', videoUrl: '', thumbnailUrl: '', provinceName: 'Gia Lai', status: 'PUBLISHED', viewCount: 2345, createdAt: '', updatedAt: '' },
    ],
    userMemories: [],
};

export default function HomePage() {
    const [data, setData] = useState<HomePageResponse>(sampleData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getHomePageData(10);
                setData({
                    ...sampleData,
                    ...response,
                    provinces: response.provinces?.length ? response.provinces : sampleData.provinces,
                    featuredTours: response.featuredTours?.length ? response.featuredTours : sampleData.featuredTours,
                    cultureItems: response.cultureItems?.length ? response.cultureItems : sampleData.cultureItems,
                    blogPosts: response.blogPosts?.length ? response.blogPosts : sampleData.blogPosts,
                    videos: response.videos?.length ? response.videos : sampleData.videos,
                });
            } catch (err) {
                console.error('Failed to fetch homepage data:', err);
                setError('Không thể tải dữ liệu. Đang hiển thị dữ liệu mẫu.');
                // Keep sample data on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--color-text-light)]">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <main>
            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-700 text-sm">{error}</p>
                </div>
            )}

            <HeroSection />

            <MapSection
                provinces={data.provinces}
                cultureItems={data.cultureItems}
            />

            <TourExperienceSection
                tours={data.featuredTours}
            />

            <QuickLearnSection
                blogPosts={data.blogPosts}
                videos={data.videos}
            />

            <TestimonialsSection />
        </main>
    );
}
