import { useState, useEffect } from 'react';
import { getBlogPosts, getVideos } from '../../services/api';
import { LearnPageContent, type LessonGroup } from '../../components/learn';

// Sample data để hiển thị ngay lập tức
const sampleData: LessonGroup[] = [
  {
    id: 1,
    title: 'Không gian Cồng Chiêng',
    slug: 'khong-gian-cong-chieng',
    category: 'Cồng chiêng',
    thumbnailUrl: '/home/slider/1.jpg',
    lessonCount: 6,
    totalDuration: 10,
  },
  {
    id: 2,
    title: 'Ẩm thực Tây Nguyên',
    slug: 'am-thuc-tay-nguyen',
    category: 'Ẩm thực',
    thumbnailUrl: '/home/slider/2.jpg',
    lessonCount: 5,
    totalDuration: 15,
  },
  {
    id: 3,
    title: 'Lễ hội cầu mùa',
    slug: 'le-hoi-cau-mua',
    category: 'Lễ hội',
    thumbnailUrl: '/home/slider/3.jpg',
    lessonCount: 4,
    totalDuration: 12,
  },
  {
    id: 4,
    title: 'Trang phục truyền thống',
    slug: 'trang-phuc-truyen-thong',
    category: 'Trang phục',
    thumbnailUrl: '/home/slider/4.jpg',
    lessonCount: 5,
    totalDuration: 12,
  },
  {
    id: 5,
    title: 'Truyền thuyết dân gian',
    slug: 'truyen-thuyet-dan-gian',
    category: 'Truyền thuyết',
    thumbnailUrl: '/home/slider/1.jpg',
    lessonCount: 6,
    totalDuration: 18,
  },
  {
    id: 6,
    title: 'Nhạc cụ dân tộc',
    slug: 'nhac-cu-dan-toc',
    category: 'Cồng chiêng',
    thumbnailUrl: '/home/slider/2.jpg',
    lessonCount: 4,
    totalDuration: 10,
  },
];

export default function LearnPage() {
  // Khởi tạo với sampleData để UI hiển thị ngay lập tức
  const [lessonGroups, setLessonGroups] = useState<LessonGroup[]>(sampleData);
  const [loading, setLoading] = useState(false); // Bắt đầu với false vì đã có data

  useEffect(() => {
    // Fetch API trong background, không block UI
    const fetchLessons = async () => {
      try {
        // Không set loading = true để không hiển thị skeleton
        // UI đã hiển thị với sampleData rồi
        const [blogPosts, videos] = await Promise.all([
          getBlogPosts().catch(() => []), // Catch error để không block
          getVideos().catch(() => []), // Catch error để không block
        ]);

        // Group lessons by category and create lesson groups
        const groupedLessons: Record<string, LessonGroup> = {};

        // Process blog posts
        blogPosts.forEach((post) => {
          const category = post.provinceName || 'Tây Nguyên';
          if (!groupedLessons[category]) {
            groupedLessons[category] = {
              id: post.id,
              title: category === 'Đắk Lắk' ? 'Không gian Cồng Chiêng' : 
                     category === 'Gia Lai' ? 'Ẩm thực Tây Nguyên' :
                     category === 'Kon Tum' ? 'Lễ hội cầu mùa' : category,
              slug: category.toLowerCase().replace(/\s+/g, '-'),
              category: category,
              thumbnailUrl: post.featuredImageUrl,
              lessonCount: 0,
              totalDuration: 0,
            };
          }
          groupedLessons[category].lessonCount += 1;
          groupedLessons[category].totalDuration += 3;
        });

        // Process videos
        videos.forEach((video) => {
          const category = video.provinceName || 'Tây Nguyên';
          if (!groupedLessons[category]) {
            groupedLessons[category] = {
              id: video.id,
              title: category === 'Đắk Lắk' ? 'Không gian Cồng Chiêng' : 
                     category === 'Gia Lai' ? 'Ẩm thực Tây Nguyên' :
                     category === 'Kon Tum' ? 'Lễ hội cầu mùa' : category,
              slug: category.toLowerCase().replace(/\s+/g, '-'),
              category: category,
              thumbnailUrl: video.thumbnailUrl,
              lessonCount: 0,
              totalDuration: 0,
            };
          }
          groupedLessons[category].lessonCount += 1;
          groupedLessons[category].totalDuration += 3;
        });

        // Nếu có data từ API, merge với sample data
        if (Object.keys(groupedLessons).length > 0) {
          const apiData = Object.values(groupedLessons);
          // Merge và remove duplicates
          const mergedData = [...apiData, ...sampleData];
          const uniqueData = mergedData.filter((item, index, self) =>
            index === self.findIndex((t) => t.slug === item.slug)
          );
          // Chỉ update nếu có data mới
          if (uniqueData.length > 0) {
            setLessonGroups(uniqueData);
          }
        }
        // Nếu không có API data, giữ nguyên sampleData (đã set từ đầu)
      } catch (error) {
        console.error('[LearnPage] API Error:', error);
        // Giữ nguyên sampleData, không cần làm gì thêm
      }
    };

    // Fetch trong background, không block rendering
    fetchLessons();
  }, []);

  return <LearnPageContent lessonGroups={lessonGroups} loading={loading} />;
}
