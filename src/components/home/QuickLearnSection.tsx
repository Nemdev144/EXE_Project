import { useEffect, useMemo, useState } from 'react';
import type { BlogPost, Video } from '../../types';
import { getBlogPosts, getVideos } from '../../services/api';
import { Play, BookOpen, ArrowRight } from 'lucide-react';
import '../../styles/components/quickLearnSection.scss';

const DEFAULT_LIMIT = 3;

export default function QuickLearnSection() {
  const [activeTab, setActiveTab] = useState<'blog' | 'video'>('blog');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchQuickLearnData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('[QuickLearnSection] 🚀 Fetching blog posts and videos...');
        const [blogData, videoData] = await Promise.all([getBlogPosts(), getVideos()]);
        if (!mounted) return;
        console.log('[QuickLearnSection] ✅ API data received:', {
          blogPosts: blogData?.length ?? 0,
          videos: videoData?.length ?? 0,
        });
        setBlogPosts(blogData ?? []);
        setVideos(videoData ?? []);
      } catch (err) {
        if (!mounted) return;
        console.error('[QuickLearnSection] ❌ API error:', err);
        setError('Không thể tải dữ liệu học nhanh văn hoá');
      } finally {
        if (mounted) {
          console.log('[QuickLearnSection] 🏁 Fetch completed');
          setLoading(false);
        }
      }
    };

    fetchQuickLearnData();

    return () => {
      mounted = false;
    };
  }, []);

  const blogItems = useMemo(
    () => blogPosts.slice(0, DEFAULT_LIMIT),
    [blogPosts]
  );
  const videoItems = useMemo(
    () => videos.slice(0, DEFAULT_LIMIT),
    [videos]
  );

  const hasItems = activeTab === 'blog' ? blogItems.length > 0 : videoItems.length > 0;
  const shouldShowError = Boolean(error) && !loading && !hasItems;

  return (
    <section className="section-container quick-learn">
      <div className="quick-learn__container">
        <h2 className="section-title">HỌC NHANH VĂN HÓA TÂY NGUYÊN</h2>
        <p className="section-subtitle">
          Tìm hiểu văn hóa Tây Nguyên qua bài viết và video ngắn
        </p>

        {/* Tabs */}
        <div className="quick-learn__tabs">
          <button
            onClick={() => setActiveTab('blog')}
            className={`quick-learn__tab ${activeTab === 'blog' ? 'quick-learn__tab--active' : ''}`}
          >
            <BookOpen className="quick-learn__tab-icon" />
            Bài viết
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`quick-learn__tab ${activeTab === 'video' ? 'quick-learn__tab--active' : ''}`}
          >
            <Play className="quick-learn__tab-icon" />
            Video
          </button>
        </div>

        {loading && (
          <div className="quick-learn__state">
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {shouldShowError && (
          <div className="quick-learn__state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !shouldShowError && (
          <>
            {/* Content Grid */}
            {activeTab === 'blog' ? (
              <div className="quick-learn__grid">
                {blogItems.map((post) => (
                  <article
                    key={post.id}
                    className="card quick-learn__card"
                  >
                    {/* Image */}
                    <div className="quick-learn__image">
                      <div
                        className="quick-learn__image-bg"
                        style={{
                          backgroundImage: `url('${post.featuredImageUrl}')`,
                        }}
                        role="img"
                        aria-label={post.title}
                      />
                      <div className="quick-learn__badge">
                        {post.provinceName || 'Tây Nguyên'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="quick-learn__content">
                      <h3 className="quick-learn__title">
                        {post.title}
                      </h3>
                      <p className="quick-learn__excerpt">
                        {post.content.substring(0, 100)}...
                      </p>
                      <div className="quick-learn__meta">
                        <span className="quick-learn__views">
                          👁️ {post.viewCount} lượt xem
                        </span>
                        <button className="quick-learn__link">
                          Xem thêm <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="quick-learn__grid">
                {videoItems.map((video) => (
                  <div key={video.id} className="card quick-learn__card">
                    {/* Video Thumbnail */}
                    <div className="quick-learn__image">
                      <div
                        className="quick-learn__image-bg"
                        style={{
                          backgroundImage: `url('${video.thumbnailUrl}')`,
                        }}
                        role="img"
                        aria-label={video.title}
                      />
                      {/* Play Button */}
                      <div className="quick-learn__video-overlay">
                        <button className="quick-learn__play">
                          <Play className="w-6 h-6 fill-current" />
                        </button>
                      </div>
                      <div className="quick-learn__badge">
                        {video.provinceName || 'Tây Nguyên'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="quick-learn__content">
                      <h3 className="quick-learn__title">
                        {video.title}
                      </h3>
                      <div className="quick-learn__meta">
                        <span className="quick-learn__views">
                          👁️ {video.viewCount} lượt xem
                        </span>
                        <button className="quick-learn__link">
                          Xem video <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!hasItems && (
              <div className="quick-learn__state">
                <p>
                  Chưa có {activeTab === 'blog' ? 'bài viết' : 'video'} nào
                </p>
              </div>
            )}
          </>
        )}

        {/* View All Button */}
        {hasItems && !loading && !shouldShowError && (
          <div className="quick-learn__footer">
            <button className="btn btn-primary text-lg px-8 py-3">
              Xem tất cả <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
