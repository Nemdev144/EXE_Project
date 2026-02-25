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

export default function HomePage() {
    // Chỉ hiển thị dữ liệu từ API
    const [data, setData] = useState<HomePageResponse>({
        provinces: [],
        featuredTours: [],
        cultureItems: [],
        artisans: [],
        blogPosts: [],
        videos: [],
        userMemories: [],
    });
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
                
                setData({
                    provinces: response?.provinces ?? [],
                    featuredTours: response?.featuredTours ?? [],
                    cultureItems: response?.cultureItems ?? [],
                    artisans: response?.artisans ?? [],
                    blogPosts: response?.blogPosts ?? [],
                    videos: response?.videos ?? [],
                    userMemories: response?.userMemories ?? [],
                });
            } catch (err: any) {
                console.error('[HomePage] ❌ API Error:', err?.message || err);
                setError('API không khả dụng. Đang hiển thị dữ liệu mẫu.');
                // Giữ dữ liệu rỗng khi API lỗi
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
                <div className="home-warning">
                    <div className="home-warning__inner">
                        <span className="home-warning__icon">⚠️</span>
                        <p className="home-warning__text">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading overlay nhỏ góc màn hình */}
            {loading && (
                <div className="home-loading-toast">
                    <div className="home-loading-toast__spinner" />
                    <span className="home-loading-toast__text">Đang tải...</span>
                </div>
            )}

            <HeroSection />
            <MapSection provinces={data.provinces} />
            <TourExperienceSection tours={data.featuredTours} />
            <QuickLearnSection />
            <TestimonialsSection testimonials={data.userMemories} />
        </main>
    );
}
