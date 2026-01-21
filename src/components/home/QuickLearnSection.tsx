import { useState } from 'react';
import { Play, Clock, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BlogPost, Video } from '../../types';

interface QuickLearnSectionProps {
    blogPosts: BlogPost[];
    videos: Video[];
}

type TabType = 'posts' | 'videos';

export default function QuickLearnSection({ blogPosts, videos }: QuickLearnSectionProps) {
    const [activeTab, setActiveTab] = useState<TabType>('posts');

    const displayedPosts = blogPosts.slice(0, 3);
    const displayedVideos = videos.slice(0, 3);

    return (
        <section className="py-20 md:py-32">
            <div className="container">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="section-title">HỌC NHANH VĂN HÓA TÂY NGUYÊN</h2>
                    <p className="section-subtitle">
                        Tìm hiểu văn hóa Tây Nguyên qua bài viết và video ngắn
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-14">
                    <div className="inline-flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'posts'
                                ? 'bg-white text-[var(--color-primary)] shadow-sm'
                                : 'text-[var(--color-text-light)] hover:text-[var(--color-text)]'
                                }`}
                        >
                            Bài viết
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'videos'
                                ? 'bg-white text-[var(--color-primary)] shadow-sm'
                                : 'text-[var(--color-text-light)] hover:text-[var(--color-text)]'
                                }`}
                        >
                            Video
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'posts' ? (
                    <div className="grid md:grid-cols-3 gap-10">
                        {displayedPosts.map((post, index) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug || post.id}`}
                                className="card group animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={post.featuredImageUrl || `https://picsum.photos/400/300?random=${post.id}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-2">
                                        <span>{post.provinceName || 'Tây Nguyên'}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            5 phút đọc
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-[var(--color-text-light)] line-clamp-2">
                                        {post.content?.substring(0, 100) || 'Khám phá những điều thú vị về văn hóa Tây Nguyên...'}
                                    </p>
                                    <div className="mt-4 flex items-center text-[var(--color-primary)] text-sm font-medium">
                                        Đọc thêm <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-10">
                        {displayedVideos.map((video, index) => (
                            <div
                                key={video.id}
                                className="card group cursor-pointer animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={video.thumbnailUrl || `https://picsum.photos/400/300?random=${video.id + 100}`}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Play className="w-7 h-7 text-[var(--color-primary)] ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                    {/* Duration Badge */}
                                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        3:45
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-2">
                                        <span>{video.provinceName || 'Tây Nguyên'}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {video.viewCount || 0} lượt xem
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                        {video.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* View All Link */}
                <div className="text-center mt-14">
                    <Link
                        to={activeTab === 'posts' ? '/blog' : '/videos'}
                        className="inline-flex items-center gap-3 bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md"
                    >
                        Xem tất cả
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
