import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, Clock, User, MapPin, ArrowLeft, Share2, BookmarkPlus } from 'lucide-react';
import { blogPostService } from '../services/api';
import type { BlogPost } from '../types';

// Sample blog post data for fallback
const sampleBlogPost: BlogPost = {
    id: 1,
    authorId: 1,
    authorName: 'Nguyễn Văn A',
    title: '5 phút tìm hiểu về Cồng Chiêng Tây Nguyên - Di sản văn hóa phi vật thể của nhân loại',
    slug: 'tim-hieu-cong-chieng',
    content: `
## Giới thiệu về Cồng Chiêng

Cồng chiêng là một nhạc cụ đặc biệt quan trọng trong đời sống văn hóa của các dân tộc Tây Nguyên. Đây không chỉ là một loại nhạc cụ mà còn là biểu tượng của sự thiêng liêng, kết nối giữa con người với thần linh và thiên nhiên.

Năm 2005, không gian văn hóa Cồng chiêng Tây Nguyên đã được UNESCO công nhận là Kiệt tác truyền khẩu và Di sản văn hóa phi vật thể của nhân loại.

## Cấu tạo của Cồng Chiêng

Cồng chiêng được làm từ đồng thau, có hình tròn, mặt hơi lồi. Tùy theo kích thước và độ dày, mỗi chiếc cồng chiêng sẽ phát ra âm thanh khác nhau. Một dàn cồng chiêng thường gồm từ 6 đến 12 chiếc, mỗi chiếc có một cao độ riêng.

### Các loại Cồng Chiêng:
- **Ching**: Cồng lớn nhất, phát ra âm thanh trầm
- **Chiêng núm**: Loại có núm ở giữa
- **Chiêng bằng**: Loại không có núm

## Vai trò trong đời sống

Cồng chiêng xuất hiện trong mọi hoạt động quan trọng của cộng đồng:
1. Lễ hội mùa màng
2. Đám cưới, đám tang
3. Lễ mừng nhà mới
4. Các nghi lễ tôn giáo

## Nghệ thuật biểu diễn

Cách đánh cồng chiêng là một nghệ thuật được truyền từ đời này sang đời khác. Người đánh chiêng phải có sự nhạy cảm với âm nhạc và khả năng phối hợp nhịp nhàng với dàn nhạc.

> "Tiếng cồng chiêng là tiếng nói của núi rừng, là lời thì thầm của ông bà tổ tiên gửi đến con cháu" - Nghệ nhân Y Thih

## Bảo tồn và phát triển

Ngày nay, việc bảo tồn văn hóa cồng chiêng đang được chú trọng thông qua:
- Các lớp truyền dạy cho thế hệ trẻ
- Festival văn hóa cồng chiêng định kỳ
- Đưa cồng chiêng vào các tour du lịch văn hóa
    `,
    featuredImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
    provinceId: 1,
    provinceName: 'Đắk Lắk',
    status: 'PUBLISHED',
    viewCount: 1250,
    publishedAt: '2025-01-15',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-15',
};

// Sample images for the gallery
const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
];

// Sample video URL (YouTube embed example)
const sampleVideoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

export default function BlogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        async function fetchBlogPost() {
            if (!id) return;

            try {
                const data = await blogPostService.getBlogPostById(Number(id));
                setBlogPost(data);
            } catch (error) {
                console.error('Error fetching blog post:', error);
                // Use sample data as fallback
                setBlogPost(sampleBlogPost);
            }

            setLoading(false);
        }

        fetchBlogPost();
    }, [id]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent"></div>
            </div>
        );
    }

    if (!blogPost) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h1>
                    <Link to="/blog" className="text-[var(--color-primary)] hover:underline">
                        ← Quay lại danh sách bài viết
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {/* Hero Image */}
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                <img
                    src={blogPost.featuredImageUrl || sampleBlogPost.featuredImageUrl}
                    alt={blogPost.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Back Button */}
                <Link
                    to="/blog"
                    className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </Link>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="container">
                        {/* Province Badge */}
                        {blogPost.provinceName && (
                            <span className="inline-flex items-center gap-1 bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg text-sm font-medium mb-4">
                                <MapPin className="w-4 h-4" />
                                {blogPost.provinceName}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">
                            {blogPost.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-[var(--color-primary)]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{blogPost.authorName || 'Tác giả'}</p>
                                    <p className="text-sm text-gray-500">Tác giả</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Calendar className="w-5 h-5" />
                                <span>{formatDate(blogPost.publishedAt || blogPost.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Eye className="w-5 h-5" />
                                <span>{blogPost.viewCount?.toLocaleString() || 0} lượt xem</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Clock className="w-5 h-5" />
                                <span>5 phút đọc</span>
                            </div>
                        </div>

                        {/* Article Content */}
                        <article className="prose prose-lg max-w-none">
                            {/* Render content - convert markdown-style content to HTML */}
                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{
                                    __html: (blogPost.content || sampleBlogPost.content)
                                        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-[var(--color-primary)] mt-8 mb-4">$1</h2>')
                                        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h3>')
                                        .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                                        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[var(--color-primary)] pl-4 italic text-gray-600 my-6">$1</blockquote>')
                                        .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
                                        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
                                        .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
                                        .replace(/\n/g, '<br/>')
                                }}
                            />
                        </article>

                        {/* Image Gallery Section */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Hình ảnh</h3>
                            <div className="space-y-4">
                                {/* Main Image */}
                                <div className="relative aspect-video rounded-2xl overflow-hidden">
                                    <img
                                        src={sampleImages[activeImage]}
                                        alt={`Hình ${activeImage + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Thumbnails */}
                                <div className="flex gap-3">
                                    {sampleImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === index
                                                ? 'border-[var(--color-primary)] scale-105'
                                                : 'border-transparent opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Video Section */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Video</h3>
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                                <iframe
                                    src={sampleVideoUrl}
                                    title="Video về Cồng Chiêng"
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <p className="text-gray-500 text-sm mt-3 text-center">
                                Video: Không gian văn hóa Cồng Chiêng Tây Nguyên
                            </p>
                        </div>

                        {/* Share Section */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-600">Chia sẻ:</span>
                                    <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:underline">
                                    <BookmarkPlus className="w-5 h-5" />
                                    Lưu bài viết
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            {/* Author Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-md">
                                <h4 className="font-bold text-gray-800 mb-4">Về tác giả</h4>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{blogPost.authorName || 'Tác giả'}</p>
                                        <p className="text-sm text-gray-500">Nhà nghiên cứu văn hóa</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Chuyên gia nghiên cứu văn hóa dân tộc Tây Nguyên với hơn 10 năm kinh nghiệm.
                                </p>
                            </div>

                            {/* Related Tours */}
                            <div className="bg-white rounded-2xl p-6 shadow-md">
                                <h4 className="font-bold text-gray-800 mb-4">Tour liên quan</h4>
                                <div className="space-y-4">
                                    <Link to="/tours" className="flex gap-3 group">
                                        <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src="https://images.unsplash.com/photo-1528127269322-539801943592?w=200"
                                                alt="Tour"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                                Trải nghiệm Cồng Chiêng Đắk Lắk
                                            </p>
                                            <p className="text-sm text-[var(--color-primary)] font-semibold">2.500.000 VND</p>
                                        </div>
                                    </Link>
                                    <Link to="/tours" className="flex gap-3 group">
                                        <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200"
                                                alt="Tour"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                                Lễ hội Cồng Chiêng Gia Lai
                                            </p>
                                            <p className="text-sm text-[var(--color-primary)] font-semibold">1.800.000 VND</p>
                                        </div>
                                    </Link>
                                </div>
                                <Link
                                    to="/tours"
                                    className="block text-center mt-4 text-[var(--color-primary)] font-semibold hover:underline"
                                >
                                    Xem tất cả tour →
                                </Link>
                            </div>

                            {/* Tags */}
                            <div className="bg-white rounded-2xl p-6 shadow-md">
                                <h4 className="font-bold text-gray-800 mb-4">Từ khóa</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Cồng Chiêng', 'Tây Nguyên', 'Di sản văn hóa', 'UNESCO', 'Đắk Lắk', 'Văn hóa dân tộc'].map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
