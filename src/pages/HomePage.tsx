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

// Rich fallback dataset - hiển thị khi API chậm/lỗi
const sampleData: HomePageResponse = {
    provinces: [
        { id: 1, name: 'Đắk Lắk', slug: 'dak-lak', region: 'Tây Nguyên', latitude: 12.6795, longitude: 108.0377, description: 'Thủ phủ cà phê Việt Nam', thumbnailUrl: '/home/slider/1.jpg', isActive: true, createdAt: '', updatedAt: '' },
        { id: 2, name: 'Gia Lai', slug: 'gia-lai', region: 'Tây Nguyên', latitude: 13.8078, longitude: 108.1094, description: 'Vùng đất đỏ bazan', thumbnailUrl: '/home/slider/2.jpg', isActive: true, createdAt: '', updatedAt: '' },
        { id: 3, name: 'Kon Tum', slug: 'kon-tum', region: 'Tây Nguyên', latitude: 14.3496, longitude: 108.0004, description: 'Nơi ngã ba Đông Dương', thumbnailUrl: '/home/slider/3.jpg', isActive: true, createdAt: '', updatedAt: '' },
        { id: 4, name: 'Đắk Nông', slug: 'dak-nong', region: 'Tây Nguyên', latitude: 12.0019, longitude: 107.6876, description: 'Công viên địa chất toàn cầu', thumbnailUrl: '/home/slider/4.jpg', isActive: true, createdAt: '', updatedAt: '' },
        { id: 5, name: 'Lâm Đồng', slug: 'lam-dong', region: 'Tây Nguyên', latitude: 11.9463, longitude: 108.4419, description: 'Thành phố ngàn hoa', thumbnailUrl: '/home/slider/5.jpg', isActive: true, createdAt: '', updatedAt: '' },
    ],
    featuredTours: [
        { id: 1, provinceId: 1, provinceName: 'Đắk Lắk', title: 'Lễ hội Cồng Chiêng', slug: 'le-hoi-cong-chieng', description: 'Trải nghiệm không gian văn hóa cồng chiêng Tây Nguyên', durationHours: 4, maxParticipants: 15, price: 2500000, thumbnailUrl: '/home/slider/1.jpg', images: [], averageRating: 4.8, totalReviews: 45, createdAt: '', updatedAt: '' },
        { id: 2, provinceId: 2, provinceName: 'Gia Lai', title: 'Hành trình cà phê', slug: 'hanh-trinh-ca-phe', description: 'Khám phá quy trình sản xuất cà phê từ A-Z', durationHours: 3, maxParticipants: 10, price: 1800000, thumbnailUrl: '/home/slider/2.jpg', images: [], averageRating: 4.9, totalReviews: 67, createdAt: '', updatedAt: '' },
        { id: 3, provinceId: 3, provinceName: 'Kon Tum', title: 'Làng nghề dệt thổ cẩm', slug: 'lang-nghe-det', description: 'Học nghệ thuật dệt thổ cẩm truyền thống', durationHours: 5, maxParticipants: 12, price: 3200000, thumbnailUrl: '/home/slider/3.jpg', images: [], averageRating: 4.7, totalReviews: 34, createdAt: '', updatedAt: '' },
        { id: 4, provinceId: 1, provinceName: 'Đắk Lắk', title: 'Nhà rông và làng cổ', slug: 'nha-rong-lang-co', description: 'Tham quan kiến trúc nhà rông độc đáo', durationHours: 4, maxParticipants: 20, price: 1500000, thumbnailUrl: '/home/slider/4.jpg', images: [], averageRating: 4.6, totalReviews: 28, createdAt: '', updatedAt: '' },
    ],
    cultureItems: [
        { id: 1, provinceId: 1, provinceName: 'Đắk Lắk', category: 'FESTIVAL', title: 'Lễ hội Cồng Chiêng', description: 'Di sản văn hóa phi vật thể UNESCO', thumbnailUrl: '/home/slider/1.jpg', images: [], createdAt: '', updatedAt: '' },
        { id: 2, provinceId: 1, provinceName: 'Đắk Lắk', category: 'FOOD', title: 'Cà phê Buôn Ma Thuột', description: 'Thương hiệu cà phê nổi tiếng thế giới', thumbnailUrl: '/home/slider/2.jpg', images: [], createdAt: '', updatedAt: '' },
        { id: 3, provinceId: 2, provinceName: 'Gia Lai', category: 'CRAFT', title: 'Nghề dệt thổ cẩm', description: 'Nghề truyền thống lâu đời của người Ê-đê', thumbnailUrl: '/home/slider/3.jpg', images: [], createdAt: '', updatedAt: '' },
    ],
    artisans: [],
    blogPosts: [
        { id: 1, authorId: 1, title: '5 phút tìm hiểu về Cồng Chiêng', slug: '5-phut-cong-chieng', content: 'Khám phá âm nhạc truyền thống của các dân tộc Tây Nguyên...', featuredImageUrl: '/home/slider/1.jpg', status: 'PUBLISHED', viewCount: 1234, createdAt: '', updatedAt: '' },
        { id: 2, authorId: 1, title: 'Cách pha cà phê Buôn Ma Thuột', slug: 'cach-pha-ca-phe', content: 'Bí quyết pha cà phê đậm đà hương vị Tây Nguyên...', featuredImageUrl: '/home/slider/2.jpg', status: 'PUBLISHED', viewCount: 2345, createdAt: '', updatedAt: '' },
    ],
    videos: [
        { id: 1, title: 'Lễ hội Cồng Chiêng 2024', videoUrl: 'https://youtube.com/watch?v=example1', thumbnailUrl: '/home/slider/1.jpg', provinceName: 'Đắk Lắk', status: 'PUBLISHED', viewCount: 5678, createdAt: '', updatedAt: '' },
        { id: 2, title: 'Hành trình cà phê Tây Nguyên', videoUrl: 'https://youtube.com/watch?v=example2', thumbnailUrl: '/home/slider/2.jpg', provinceName: 'Gia Lai', status: 'PUBLISHED', viewCount: 3456, createdAt: '', updatedAt: '' },
    ],
    userMemories: [],
};

export default function HomePage() {
    // Khởi tạo với sampleData để UI luôn hiển thị ngay
    const [data, setData] = useState<HomePageResponse>(sampleData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log('[HomePage] 🚀 Starting API fetch...');
            try {
                setLoading(true);
                setError(null);
                
                const response = await getHomePageData(10);
                console.log('[HomePage] ✅ API Success:', {
                    provinces: response?.provinces?.length || 0,
                    tours: response?.featuredTours?.length || 0,
                    blogs: response?.blogPosts?.length || 0,
                });
                
                // Merge API data với sample data (fallback cho các field rỗng)
                setData({
                    provinces: response?.provinces?.length ? response.provinces : sampleData.provinces,
                    featuredTours: response?.featuredTours?.length ? response.featuredTours : sampleData.featuredTours,
                    cultureItems: response?.cultureItems?.length ? response.cultureItems : sampleData.cultureItems,
                    artisans: response?.artisans || sampleData.artisans,
                    blogPosts: response?.blogPosts?.length ? response.blogPosts : sampleData.blogPosts,
                    videos: response?.videos?.length ? response.videos : sampleData.videos,
                    userMemories: response?.userMemories || sampleData.userMemories,
                });
            } catch (err: any) {
                console.error('[HomePage] ❌ API Error:', err?.message || err);
                setError('API không khả dụng. Đang hiển thị dữ liệu mẫu.');
                // Giữ nguyên sampleData đã set ban đầu
            } finally {
                setLoading(false);
                console.log('[HomePage] 🏁 Fetch completed, loading = false');
            }
        };

        fetchData();
    }, []);

    // LUÔN render giao diện, chỉ thêm warning banner nếu có lỗi
    return (
        <main>
            {/* Warning banner khi API lỗi */}
            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-center">
                        <span className="text-yellow-600 mr-2">⚠️</span>
                        <p className="text-yellow-700 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading overlay nhỏ góc màn hình */}
            {loading && (
                <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 flex items-center gap-2 z-50">
                    <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-600">Đang tải...</span>
                </div>
            )}

            <HeroSection />
            <MapSection provinces={data.provinces} />
            <TourExperienceSection tours={data.featuredTours} />
            <QuickLearnSection
                blogPosts={data.blogPosts}
                videos={data.videos}
            />
            <TestimonialsSection testimonials={data.userMemories} />
        </main>
    );
}
