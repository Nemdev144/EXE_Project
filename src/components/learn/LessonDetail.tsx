/**
 * Learn – Chi tiết bài học (gộp: LessonHeader, LessonHero, LessonObjectives, LessonSummary,
 * LessonVocabulary, LessonQuickNotes, LessonRelated, LessonQuizCTA)
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Bookmark,
  Share2,
  User,
  Eye,
  Clock,
  Pin,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// LessonHero
// ---------------------------------------------------------------------------
interface LessonHeroProps {
  imageUrl: string;
  alt: string;
}

export function LessonHero({ imageUrl, alt }: LessonHeroProps) {
  return (
    <div className="lesson-hero">
      <img src={imageUrl} alt={alt} className="lesson-hero__image" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonHeader
// ---------------------------------------------------------------------------
interface LessonHeaderProps {
  title: string;
  authorName: string;
  authorAvatar?: string;
  publishedAt?: string;
  viewCount?: number;
}

export function LessonHeader({
  title,
  authorName,
  authorAvatar,
  publishedAt = '2 ngày trước',
  viewCount = 2400,
}: LessonHeaderProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);

  return (
    <div className="lesson-header">
      <h1 className="lesson-header__title">{title}</h1>
      <div className="lesson-header__meta">
        <div className="lesson-header__author">
          <div className="lesson-header__avatar">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} />
            ) : (
              <User size={24} />
            )}
          </div>
          <div className="lesson-header__author-info">
            <div className="lesson-header__author-name">{authorName}</div>
            <div className="lesson-header__author-meta">
              <Clock size={14} />
              <span>{publishedAt}</span>
              <span className="lesson-header__separator">•</span>
              <Eye size={14} />
              <span>{(viewCount / 1000).toFixed(1)}K lượt xem</span>
            </div>
          </div>
          <button
            className={`lesson-header__follow-btn ${following ? 'lesson-header__follow-btn--following' : ''}`}
            onClick={() => setFollowing(!following)}
          >
            {following ? 'Đang theo dõi' : 'Theo dõi'}
          </button>
        </div>
        <div className="lesson-header__actions">
          <button
            className={`lesson-header__action-btn ${liked ? 'lesson-header__action-btn--active' : ''}`}
            onClick={() => setLiked(!liked)}
            aria-label="Thích"
          >
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
            <span>Thích</span>
          </button>
          <button
            className={`lesson-header__action-btn ${saved ? 'lesson-header__action-btn--active' : ''}`}
            onClick={() => setSaved(!saved)}
            aria-label="Lưu để xem sau"
          >
            <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
            <span>Lưu để xem sau</span>
          </button>
          <button className="lesson-header__action-btn" aria-label="Chia sẻ">
            <Share2 size={20} />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonObjectives
// ---------------------------------------------------------------------------
interface LessonObjectivesProps {
  objectives: string[];
}

export function LessonObjectives({ objectives }: LessonObjectivesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const progress = ((currentIndex + 1) / objectives.length) * 100;

  return (
    <div className={`lesson-objectives ${isPinned ? 'lesson-objectives--pinned' : ''}`}>
      <div className="lesson-objectives__header">
        <h2 className="lesson-objectives__title">Mục tiêu bài học</h2>
        <div className="lesson-objectives__controls">
          <button
            className={`lesson-objectives__control-btn ${isPinned ? 'lesson-objectives__control-btn--active' : ''}`}
            onClick={() => setIsPinned(!isPinned)}
            aria-label={isPinned ? 'Bỏ cố định' : 'Cố định'}
          >
            <Pin size={16} />
          </button>
          <button
            className="lesson-objectives__control-btn"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % objectives.length)}
            aria-label="Làm mới"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      <div className="lesson-objectives__content">
        <p className="lesson-objectives__text">{objectives[currentIndex]}</p>
        <div className="lesson-objectives__progress">
          <span className="lesson-objectives__progress-text">
            {currentIndex + 1}/{objectives.length}
          </span>
          <div className="lesson-objectives__progress-bar">
            <div
              className="lesson-objectives__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonSummary
// ---------------------------------------------------------------------------
interface SummarySection {
  title: string;
  content: string;
}

interface LessonSummaryProps {
  sections: SummarySection[];
}

export function LessonSummary({ sections }: LessonSummaryProps) {
  return (
    <div className="lesson-summary">
      <h2 className="lesson-summary__title">Tóm tắt nội dung</h2>
      <div className="lesson-summary__content">
        {sections.map((section, index) => (
          <div key={index} className="lesson-summary__section">
            <h3 className="lesson-summary__section-title">{section.title}</h3>
            <p className="lesson-summary__section-content">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonVocabulary
// ---------------------------------------------------------------------------
interface VocabularyItem {
  term: string;
  definition: string;
}

interface LessonVocabularyProps {
  items: VocabularyItem[];
}

export function LessonVocabulary({ items }: LessonVocabularyProps) {
  return (
    <div className="lesson-vocabulary">
      <h2 className="lesson-vocabulary__title">Từ vựng & Khái niệm</h2>
      <div className="lesson-vocabulary__list">
        {items.map((item, index) => (
          <div key={index} className="lesson-vocabulary__item">
            <div className="lesson-vocabulary__term">{item.term}</div>
            <div className="lesson-vocabulary__definition">{item.definition}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonQuickNotes
// ---------------------------------------------------------------------------
interface LessonQuickNotesProps {
  notes: string[];
  tip?: { title: string; content: string };
}

export function LessonQuickNotes({ notes, tip }: LessonQuickNotesProps) {
  return (
    <div className="lesson-quick-notes">
      <h2 className="lesson-quick-notes__title">Ghi chú nhanh</h2>
      <ol className="lesson-quick-notes__list">
        {notes.map((note, index) => (
          <li key={index} className="lesson-quick-notes__item">
            {note}
          </li>
        ))}
      </ol>
      {tip && (
        <div className="lesson-quick-notes__tip">
          <div className="lesson-quick-notes__tip-icon">
            <Lightbulb size={24} />
          </div>
          <div className="lesson-quick-notes__tip-content">
            <strong className="lesson-quick-notes__tip-title">{tip.title}</strong>
            <p className="lesson-quick-notes__tip-text">{tip.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonRelated
// ---------------------------------------------------------------------------
interface RelatedLesson {
  id: number;
  title: string;
  duration: string;
  thumbnailUrl: string;
  slug: string;
  category: string;
}

interface LessonRelatedProps {
  lessons: RelatedLesson[];
}

export function LessonRelated({ lessons }: LessonRelatedProps) {
  return (
    <div className="lesson-related">
      <h2 className="lesson-related__title">Bài học liên quan</h2>
      <div className="lesson-related__list">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/learn/${lesson.category}/${lesson.slug}`}
            state={{ lessonId: lesson.id }}
            className="lesson-related__card"
          >
            <img
              src={lesson.thumbnailUrl}
              alt={lesson.title}
              className="lesson-related__thumbnail"
            />
            <div className="lesson-related__content">
              <h3 className="lesson-related__card-title">{lesson.title}</h3>
              <div className="lesson-related__duration">
                <Clock size={14} />
                <span>{lesson.duration}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonQuizCTA
// ---------------------------------------------------------------------------
interface LessonQuizCTAProps {
  category: string;
  slug: string;
  questionCount?: number;
  /** Nếu có, navigate với state.quizId để QuizPage load đúng đề */
  quizId?: number;
}

export function LessonQuizCTA({ category, slug, questionCount = 5, quizId }: LessonQuizCTAProps) {
  const navigate = useNavigate();

  const goToQuiz = () => {
    if (quizId != null) {
      navigate(`/learn/${category}/${slug}/quiz`, { state: { quizId } });
    } else {
      navigate(`/learn/${category}/${slug}/quiz`);
    }
  };

  return (
    <div className="lesson-quiz-cta">
      <h2 className="lesson-quiz-cta__title">Sẵn sàng kiểm tra kiến thức?</h2>
      <p className="lesson-quiz-cta__subtitle">
        Hoàn thành {questionCount} câu hỏi để củng cố kiến thức vừa học.
      </p>
      <button
        className="lesson-quiz-cta__button"
        onClick={goToQuiz}
      >
        Làm Quiz ngay
      </button>
    </div>
  );
}
