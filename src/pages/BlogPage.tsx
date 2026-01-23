import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Search, Clock, Eye, ArrowRight, User } from 'lucide-react';
import { blogPostService, provinceService } from '../services/api';
import type { BlogPost, Province } from '../types';

// Sample blog posts data for fallback
const sampleBlogPosts: BlogPost[] = [
    {
        id: 1,
        authorId: 1,
        authorName: 'Nguyễn Văn A',
        title: '5 phút tìm hiểu về Cồng Chiêng',
        slug: 'tim-hieu-cong-chieng',
        content: 'Khám phá âm nhạc truyền thống của các dân tộc Tây Nguyên...',
        featuredImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        provinceId: 1,
        provinceName: 'Đắk Lắk',
        status: 'PUBLISHED',
        viewCount: 1250,
        publishedAt: '2025-01-15',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-15',
    },
    {
        id: 2,
        authorId: 2,
        authorName: 'Trần Thị B',
        title: 'Cách pha cà phê Buôn Ma Thuột',
        slug: 'cach-pha-ca-phe-buon-ma-thuot',
        content: 'Bí quyết pha cà phê đậm đà hương vị Tây Nguyên...',
        featuredImageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
        provinceId: 1,
        provinceName: 'Đắk Lắk',
        status: 'PUBLISHED',
        viewCount: 2340,
        publishedAt: '2025-01-12',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-12',
    },
    {
        id: 3,
        authorId: 1,
        authorName: 'Nguyễn Văn A',
        title: 'Trang phục truyền thống Ê-đê',
        slug: 'trang-phuc-truyen-thong-ede',
        content: 'Tìm hiểu về những hoa tiết độc đáo trên trang phục...',
        featuredImageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400',
        provinceId: 1,
        provinceName: 'Đắk Lắk',
        status: 'PUBLISHED',
        viewCount: 890,
        publishedAt: '2025-01-10',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-10',
    },
    {
        id: 4,
        authorId: 3,
        authorName: 'Lê Văn C',
        title: 'Nhà Rông - Biểu tượng văn hóa Tây Nguyên',
        slug: 'nha-rong-bieu-tuong-van-hoa',
        content: 'Kiến trúc độc đáo của nhà Rông trong đời sống người Gia Rai...',
        featuredImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        provinceId: 3,
        provinceName: 'Gia Lai',
        status: 'PUBLISHED',
        viewCount: 1560,
        publishedAt: '2025-01-08',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-08',
    },
    {
        id: 5,
        authorId: 2,
        authorName: 'Trần Thị B',
        title: 'Lễ hội Cồng Chiêng Tây Nguyên',
        slug: 'le-hoi-cong-chieng-tay-nguyen',
        content: 'Di sản văn hóa phi vật thể được UNESCO công nhận...',
        featuredImageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
        provinceId: 2,
        provinceName: 'Kon Tum',
        status: 'PUBLISHED',
        viewCount: 3200,
        publishedAt: '2025-01-05',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-05',
    },
    {
        id: 6,
        authorId: 1,
        authorName: 'Nguyễn Văn A',
        title: 'Nghệ thuật dệt thổ cẩm Tây Nguyên',
        slug: 'nghe-thuat-det-tho-cam',
        content: 'Khám phá kỹ thuật dệt truyền thống của người Ba Na...',
        featuredImageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
        provinceId: 2,
        provinceName: 'Kon Tum',
        status: 'PUBLISHED',
        viewCount: 780,
        publishedAt: '2025-01-03',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-03',
    },
];

const sampleProvinces: Province[] = [
    { id: 1, name: 'Đắk Lắk', slug: 'dak-lak', region: 'Tây Nguyên', latitude: 12.68, longitude: 108.04, description: '', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
    { id: 2, name: 'Kon Tum', slug: 'kon-tum', region: 'Tây Nguyên', latitude: 14.35, longitude: 108.00, description: '', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
    { id: 3, name: 'Gia Lai', slug: 'gia-lai', region: 'Tây Nguyên', latitude: 13.81, longitude: 108.11, description: '', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
    { id: 4, name: 'Đắk Nông', slug: 'dak-nong', region: 'Tây Nguyên', latitude: 12.00, longitude: 107.69, description: '', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
    { id: 5, name: 'Lâm Đồng', slug: 'lam-dong', region: 'Tây Nguyên', latitude: 11.95, longitude: 108.44, description: '', thumbnailUrl: '', isActive: true, createdAt: '', updatedAt: '' },
];

export default function BlogPage() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const provincesData = await provinceService.getProvinces();
                setProvinces(provincesData);
            } catch (error) {
                console.error('Error fetching provinces:', error);
                setProvinces(sampleProvinces);
            }

            try {
                const blogData = await blogPostService.getBlogPosts({
                    provinceId: selectedProvinceId || undefined,
                    limit: 20,
                    status: 'PUBLISHED',
                });
                setBlogPosts(blogData.blogPosts || []);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
                if (selectedProvinceId) {
                    setBlogPosts(sampleBlogPosts.filter(p => p.provinceId === selectedProvinceId));
                } else {
                    setBlogPosts(sampleBlogPosts);
                }
            }

            setLoading(false);
        }

        fetchData();
    }, [selectedProvinceId]);

    const handleSearch = () => {
        setLoading(true);
        blogPostService.getBlogPosts({
            provinceId: selectedProvinceId || undefined,
            limit: 20,
            status: 'PUBLISHED',
        }).then(data => {
            let posts = data.blogPosts || [];
            if (searchQuery) {
                posts = posts.filter(p =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            setBlogPosts(posts);
            setLoading(false);
        }).catch(() => {
            let posts = selectedProvinceId
                ? sampleBlogPosts.filter(p => p.provinceId === selectedProvinceId)
                : sampleBlogPosts;
            if (searchQuery) {
                posts = posts.filter(p =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            setBlogPosts(posts);
            setLoading(false);
        });
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const displayedPosts = blogPosts.length > 0 ? blogPosts : sampleBlogPosts;

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[350px] md:h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#8B4513] via-[#A0522D] to-[#CD853F]">
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="container relative h-full flex flex-col items-center justify-center text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                        BÀI VIẾT VĂN HÓA
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl max-w-3xl mb-8 leading-relaxed">
                        Khám phá những câu chuyện, kiến thức và bí mật văn hóa đặc sắc
                        của vùng đất Tây Nguyên hùng vĩ
                    </p>
                </div>
            </section>

            {/* Search/Filter Bar */}
            <section className="py-8 bg-white">
                <div className="container">
                    <div className="bg-white rounded-2xl shadow-lg p-6 -mt-16 relative z-10 border border-gray-100">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
                                <Search className="w-6 h-6 text-[var(--color-primary)]" />
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-500 mb-1">Tìm kiếm bài viết</label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Nhập từ khóa..."
                                        className="w-full text-gray-800 font-medium bg-transparent focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Province Filter */}
                            <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
                                <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-500 mb-1">Tỉnh thành</label>
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

            {/* Blog Posts List */}
            <section className="py-16 md:py-24 bg-[var(--color-bg)]">
                <div className="container">
                    {/* Section Header */}
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4 tracking-wide">
                            BÀI VIẾT NỔI BẬT
                        </h2>
                        {selectedProvinceId && (
                            <p className="text-[var(--color-text-light)]">
                                Đang hiển thị bài viết tại {provinces.find(p => p.id === selectedProvinceId)?.name}
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
                            {/* Blog Posts Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayedPosts.map((post, index) => (
                                    <article
                                        key={post.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {/* Post Image */}
                                        <div className="relative h-52 overflow-hidden">
                                            <img
                                                src={post.featuredImageUrl || `https://picsum.photos/400/300?random=${post.id}`}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Province Badge */}
                                            {post.provinceName && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                                                        {post.provinceName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Post Content */}
                                        <div className="p-6">
                                            {/* Meta Info */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    <span>{post.authorName || 'Tác giả'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-[var(--color-primary)] transition-colors">
                                                {post.title}
                                            </h3>

                                            <p className="text-sm text-[var(--color-text-light)] mb-4 line-clamp-2">
                                                {post.content}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" />
                                                        <span>{post.viewCount?.toLocaleString() || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>5 phút đọc</span>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/blog/${post.id}`}
                                                    className="text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1"
                                                >
                                                    Đọc thêm
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
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
