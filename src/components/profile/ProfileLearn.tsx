import { useState } from 'react';
import { Award, BookOpen, TrendingUp, Flame, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LearnStats, FeaturedCourse } from '../../services/profileApi';
import '../../styles/components/profile/_profile-learn.scss';

const COURSES_PER_PAGE = 3;

interface ProfileLearnProps {
  stats: LearnStats | null;
  coursesInProgress?: FeaturedCourse[];
  savedCourses?: FeaturedCourse[];
}

function CourseCarousel({ courses, title }: { courses: FeaturedCourse[]; title: string }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(courses.length / COURSES_PER_PAGE));
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;
  const visible = courses.slice(page * COURSES_PER_PAGE, page * COURSES_PER_PAGE + COURSES_PER_PAGE);

  return (
    <>
      <h4 className="profile-learn__saved-title">{title}</h4>
      {courses.length > 0 ? (
        <>
          <div className="profile-learn__carousel">
            <button
              type="button"
              className="profile-learn__carousel-btn profile-learn__carousel-btn--prev"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={!canPrev}
              aria-label="Xem trước"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="profile-learn__courses">
              {visible.map((course) => (
                <Link
                  key={course.id}
                  to={`/learn/${course.id}`}
                  className="profile-learn__course-card"
                >
                  <img
                    src={course.thumbnailUrl || ''}
                    alt={course.title}
                    className="profile-learn__course-img"
                  />
                  <h4 className="profile-learn__course-title">{course.title}</h4>
                  <span className="profile-learn__course-date">
                    {course.lessonsCount ?? 0} bài học
                  </span>
                  <span className="profile-learn__course-link">
                    Xem lại bài giảng <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="profile-learn__carousel-btn profile-learn__carousel-btn--next"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={!canNext}
              aria-label="Xem sau"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          {totalPages > 1 && (
            <div className="profile-learn__carousel-dots">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`profile-learn__carousel-dot ${i === page ? 'profile-learn__carousel-dot--active' : ''}`}
                  onClick={() => setPage(i)}
                  aria-label={`Trang ${i + 1}`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="profile-learn__saved-empty">
          {title.includes('đang học') ? 'Bạn chưa bắt đầu khóa nào.' : 'Bạn chưa lưu bài nào. Nhấn nút "Lưu để xem sau" khi xem bài học để lưu.'}
        </p>
      )}
    </>
  );
}

export default function ProfileLearn({ stats, coursesInProgress = [], savedCourses = [] }: ProfileLearnProps) {

  if (!stats) {
    return (
      <div className="profile-learn">
        <h3 className="profile-learn__title">Học & Quiz</h3>
        <div className="profile-learn__empty">
          <BookOpen size={40} />
          <p>Bạn chưa tham gia khoá học nào.</p>
          <Link to="/learn" className="profile-learn__start-btn">
            Bắt đầu học ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-learn">
      <h3 className="profile-learn__title">Học & Quiz</h3>

      {/* Achievement banner */}
      {stats.averageScore >= 100 && stats.featuredCourses.length > 0 && (
        <div className="profile-learn__banner">
          <div className="profile-learn__banner-icon">
            <Award size={32} />
          </div>
          <div className="profile-learn__banner-content">
            <strong>
              Chúc mừng! Bạn đạt 100% quiz ở "{stats.featuredCourses[0]?.title}"
            </strong>
            <p>Voucher tặng: COIVIET-50K (50.000đ)</p>
            <p className="profile-learn__banner-note">
              Áp dụng cho tour nội địa, tối thiểu 500k. Hạn 30 ngày từ ngày nhận
            </p>
          </div>
          <button className="profile-learn__claim-btn">Nhận voucher</button>
        </div>
      )}

      {/* Stats cards */}
      <div className="profile-learn__stats">
        <div className="profile-learn__stat-card">
          <span className="profile-learn__stat-value profile-learn__stat-value--primary">
            {stats.totalLessonsCompleted}
          </span>
          <span className="profile-learn__stat-label">
            <BookOpen size={14} /> Tổng số bài đã học
          </span>
        </div>
        <div className="profile-learn__stat-card">
          <span className="profile-learn__stat-value profile-learn__stat-value--accent">
            {stats.averageScore}%
          </span>
          <span className="profile-learn__stat-label">
            <TrendingUp size={14} /> Điểm trung bình
          </span>
        </div>
        <div className="profile-learn__stat-card">
          <span className="profile-learn__stat-value profile-learn__stat-value--blue">
            {stats.learningStreak}
          </span>
          <span className="profile-learn__stat-label">
            <Flame size={14} /> Streak ngày học
          </span>
        </div>
      </div>

      {/* Khóa đang học - phía trên */}
      <div className="profile-learn__saved">
        <CourseCarousel courses={coursesInProgress} title="Khóa đang học" />
      </div>

      {/* Ngăn cách */}
      <div className="profile-learn__divider" />

      {/* Bài đã lưu / Khóa sẵn có - phía dưới */}
      <div className="profile-learn__saved">
        <CourseCarousel courses={savedCourses} title="Bài đã lưu" />
      </div>
    </div>
  );
}
