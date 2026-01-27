'use client';

import { useState } from 'react';
import { BlogPost, Video } from '@/lib/types';
import { Play, BookOpen, ArrowRight } from 'lucide-react';

interface QuickLearnSectionProps {
  blogPosts: BlogPost[];
  videos: Video[];
}

export default function QuickLearnSection({ blogPosts, videos }: QuickLearnSectionProps) {
  const [activeTab, setActiveTab] = useState<'blog' | 'video'>('blog');

  const displayItems = activeTab === 'blog' ? blogPosts.slice(0, 3) : videos.slice(0, 3);

  return (
    <section className="section-container bg-[var(--color-bg)]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">HỌC NHANH VĂN HÓA TÂY NGUYÊN</h2>
        <p className="section-subtitle">
          Tìm hiểu văn hóa Tây Nguyên qua bài viết và video ngắn
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-8 py-3 text-lg font-semibold rounded-lg transition-all ${
              activeTab === 'blog'
                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                : 'bg-white text-[var(--color-text)] border-2 border-[var(--color-primary)] hover:bg-gray-50'
            }`}
          >
            <BookOpen className="inline w-5 h-5 mr-2" />
            Bài viết
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-8 py-3 text-lg font-semibold rounded-lg transition-all ${
              activeTab === 'video'
                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                : 'bg-white text-[var(--color-text)] border-2 border-[var(--color-primary)] hover:bg-gray-50'
            }`}
          >
            <Play className="inline w-5 h-5 mr-2" />
            Video
          </button>
        </div>

        {/* Content Grid */}
        {activeTab === 'blog' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayItems.map((post) => (
              <article
                key={post.id}
                className="card group cursor-pointer overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url('${post.featuredImageUrl}')`,
                    }}
                    role="img"
                    aria-label={post.title}
                  />
                  <div className="absolute top-3 left-3 bg-[var(--color-primary)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {post.provinceName || 'Tây Nguyên'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-base mb-3 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 h-14">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-light)] mb-4 line-clamp-2">
                    {post.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-[var(--color-text-light)]">
                      👁️ {post.viewCount} lượt xem
                    </span>
                    <button className="text-[var(--color-primary)] font-semibold text-sm hover:flex gap-1 items-center transition-all">
                      Xem thêm <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayItems.map((video) => (
              <div key={video.id} className="card group cursor-pointer overflow-hidden">
                {/* Video Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url('${video.thumbnailUrl}')`,
                    }}
                    role="img"
                    aria-label={video.title}
                  />
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                    <button className="bg-[var(--color-primary)] text-white p-4 rounded-full group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 bg-[var(--color-primary)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {video.provinceName || 'Tây Nguyên'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-base mb-3 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 h-14">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-[var(--color-text-light)]">
                      👁️ {video.viewCount} lượt xem
                    </span>
                    <button className="text-[var(--color-primary)] font-semibold text-sm hover:flex gap-1 items-center transition-all">
                      Xem video <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {displayItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-light)] text-lg">
              Chưa có {activeTab === 'blog' ? 'bài viết' : 'video'} nào
            </p>
          </div>
        )}

        {/* View All Button */}
        {displayItems.length > 0 && (
          <div className="text-center mt-12">
            <button className="btn btn-primary text-lg px-8 py-3">
              Xem tất cả <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
