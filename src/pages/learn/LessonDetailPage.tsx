import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import {
  LessonHero,
  LessonHeader,
  LessonObjectives,
  LessonSummary,
  LessonVocabulary,
  LessonQuickNotes,
  LessonRelated,
  LessonQuizCTA,
} from '../../components/learn';
import { getBlogPostById, getVideoById } from '../../services/api';
import type { BlogPost, Video } from '../../types';
import '../../styles/pages/_lesson-detail.scss';

// Sample data để hiển thị ngay lập tức
const sampleLessonData = {
  title: 'Bài 1 - Cồng chiêng trong nghi lễ cộng đồng',
  thumbnailUrl: '/home/slider/1.jpg',
  authorName: 'Nghệ nhân Đình Vân Thành',
  publishedAt: '2 ngày trước',
  viewCount: 2400,
  objectives: [
    'Hiểu vai trò cồng chiêng trong bối cảnh lễ hội',
    'Nhận biết các loại cồng chiêng phổ biến',
    'Nắm được kỹ thuật biểu diễn cơ bản',
  ],
  summarySections: [
    {
      title: 'Giới thiệu về cồng chiêng',
      content: 'Cồng chiêng là nhạc cụ truyền thống đặc trưng của các dân tộc Tây Nguyên, được làm từ đồng và có vai trò quan trọng trong đời sống văn hóa tâm linh của cộng đồng.',
    },
    {
      title: 'Vai trò trong nghi lễ',
      content: 'Cồng chiêng được sử dụng trong các nghi lễ quan trọng như lễ mừng lúa mới, lễ cầu mưa, lễ cúng bến nước, tạo nên không gian thiêng liêng và kết nối cộng đồng.',
    },
    {
      title: 'Kỹ thuật biểu diễn',
      content: 'Việc biểu diễn cồng chiêng đòi hỏi sự phối hợp nhịp nhàng giữa các nghệ nhân, mỗi người chơi một chiếc cồng hoặc chiêng khác nhau để tạo nên bản nhạc hoàn chỉnh.',
    },
  ],
  vocabulary: [
    { term: 'Cồng', definition: 'Nhạc cụ bằng đồng, phát ra âm thanh khi gõ' },
    { term: 'Chiêng', definition: 'Nhạc cụ tương tự cồng nhưng có kích thước lớn hơn' },
    { term: 'Xoang', definition: 'Điệu múa truyền thống của các dân tộc Tây Nguyên' },
    { term: 'Già làng', definition: 'Người đứng đầu làng, có vai trò quan trọng trong các nghi lễ' },
    { term: 'Lễ mừng lúa mới', definition: 'Nghi lễ quan trọng của các dân tộc Tây Nguyên để cảm ơn thần linh và cầu mong mùa màng tốt tươi' },
  ],
  quickNotes: [
    'Cồng chiêng là di sản văn hóa phi vật thể của UNESCO',
    'Mỗi dân tộc có cách biểu diễn cồng chiêng riêng',
    'Cồng chiêng thường được sử dụng trong các nghi lễ quan trọng',
    'Kỹ thuật gõ cồng chiêng đòi hỏi sự phối hợp nhịp nhàng',
    'Âm thanh cồng chiêng có thể truyền tải nhiều cảm xúc khác nhau',
    'Việc bảo tồn cồng chiêng đang được chú trọng để giữ gìn văn hóa truyền thống',
  ],
  tip: {
    title: 'Điều nên lưu ý khi tham gia nghi lễ',
    content: 'Khi tham gia các nghi lễ có cồng chiêng, cần tôn trọng không gian thiêng liêng và tuân thủ các quy tắc của cộng đồng địa phương. Nên mặc trang phục phù hợp và giữ im lặng trong những khoảnh khắc quan trọng.',
  },
  relatedLessons: [
    {
      id: 2,
      title: 'Bài 2: Cách chế tác Cồng chiêng truyền thống',
      duration: '4:10',
      thumbnailUrl: '/home/slider/2.jpg',
      slug: 'cach-che-tac-cong-chieng',
      category: 'cong-chieng',
    },
    {
      id: 3,
      title: 'Bài 3: Ý nghĩa tâm linh âm thanh cồng chiêng',
      duration: '5:20',
      thumbnailUrl: '/home/slider/3.jpg',
      slug: 'y-nghia-tam-linh-am-thanh',
      category: 'cong-chieng',
    },
  ],
};

export default function LessonDetailPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [lesson, setLesson] = useState<BlogPost | Video | null>(null);
  const [loading, setLoading] = useState(false); // Bắt đầu với false để hiển thị sample data ngay

  useEffect(() => {
    // Fetch API trong background
    const fetchLesson = async () => {
      try {
        // Try to fetch as blog post first, then video
        try {
          const blogPost = await getBlogPostById(parseInt(slug || '0'));
          setLesson(blogPost);
        } catch {
          const video = await getVideoById(parseInt(slug || '0'));
          setLesson(video);
        }
      } catch (error) {
        console.error('[LessonDetailPage] API Error:', error);
        // Giữ nguyên sample data nếu API lỗi
      }
    };

    if (slug) {
      fetchLesson();
    }
  }, [slug]);

  // Sử dụng sample data nếu chưa có lesson từ API
  const isVideo = lesson ? 'videoUrl' in lesson : false;
  const thumbnailUrl = lesson
    ? isVideo
      ? lesson.thumbnailUrl
      : (lesson as BlogPost).featuredImageUrl
    : sampleLessonData.thumbnailUrl;
  const title = lesson?.title || sampleLessonData.title;
  const authorName =
    lesson && 'authorName' in lesson
      ? lesson.authorName
      : sampleLessonData.authorName;
  const viewCount =
    lesson && 'viewCount' in lesson
      ? lesson.viewCount
      : lesson && (lesson as BlogPost).viewCount
        ? (lesson as BlogPost).viewCount
        : sampleLessonData.viewCount;

  const breadcrumbItems = [
    { label: 'Học nhanh', path: '/learn' },
    { label: category || 'Cồng chiêng', path: `/learn/${category}` },
    { label: 'Bài 1: Nghi lễ' },
  ];

  return (
    <div className="lesson-detail-page">
      <div className="lesson-detail-page__container">
        <Breadcrumbs items={breadcrumbItems} />

        <LessonHero imageUrl={thumbnailUrl} alt={title} />

        <LessonHeader
          title={title}
          authorName={authorName}
          publishedAt={sampleLessonData.publishedAt}
          viewCount={viewCount}
        />

        <div className="lesson-detail-page__content">
          <div className="lesson-detail-page__main">
            <LessonObjectives objectives={sampleLessonData.objectives} />
            <LessonSummary sections={sampleLessonData.summarySections} />
          </div>

          <div className="lesson-detail-page__sidebar">
            <LessonVocabulary items={sampleLessonData.vocabulary} />
            <LessonRelated lessons={sampleLessonData.relatedLessons} />
          </div>
        </div>

        <LessonQuickNotes notes={sampleLessonData.quickNotes} tip={sampleLessonData.tip} />

        <LessonQuizCTA category={category || 'cong-chieng'} slug={slug || 'bai-1'} />
      </div>
    </div>
  );
}
