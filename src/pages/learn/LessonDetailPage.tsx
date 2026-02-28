/**
 * LessonDetailPage – Trang chi tiết module + bài học
 *
 * Luồng API:
 *   1) GET /api/learn/public/modules/{moduleId}  → lấy module + mảng lessons[]
 *   2) GET /api/learn/public/lessons/{lessonId}   → lấy nội dung bài học cụ thể
 *   3) Khi ấn bài khác ở sidebar → gọi lại (2) với lessonId mới
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs';
import {
  LessonHero,
  LessonHeader,
  LessonObjectives,
  LessonSummary,
  LessonVocabulary,
  LessonQuickNotes,
  LessonQuizCTA,
} from '../../components/learn';
import { getModuleById, getLessonById, getApiErrorMessage } from '../../services/api';
import type { LearnModule, LearnLesson, LearnModuleLesson } from '../../types';
import '../../styles/pages/_lesson-detail.scss';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseSections(json: string): { title: string; content: string }[] {
  if (!json || json.trim() === '') return [];
  if (json.trim().startsWith('<')) {
    return [{ title: '', content: json }];
  }
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((x): x is Record<string, unknown> => x != null && typeof x === 'object')
        .map((x) => ({
          title: typeof x.title === 'string' ? x.title : '',
          content: typeof x.content === 'string' ? x.content : '',
        }));
    }
    return [];
  } catch {
    return [{ title: '', content: json }];
  }
}

function parseVocabulary(json: string): { term: string; definition: string }[] {
  if (!json || json.trim() === '') return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is Record<string, unknown> => x != null && typeof x === 'object')
      .map((x) => ({
        term: typeof x.term === 'string' ? x.term : '',
        definition: typeof x.definition === 'string' ? x.definition : '',
      }))
      .filter((x) => x.term || x.definition);
  } catch {
    return [];
  }
}

function parseQuickNotes(json: string): string[] {
  if (!json || json.trim() === '') return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string')
      : [];
  } catch {
    return [];
  }
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// LessonSidebar – danh sách bài học trong module
// ---------------------------------------------------------------------------
interface LessonSidebarProps {
  lessons: LearnModuleLesson[];
  activeLessonId: number | null;
  onSelectLesson: (id: number) => void;
}

function LessonSidebar({ lessons, activeLessonId, onSelectLesson }: LessonSidebarProps) {
  const sorted = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="lesson-sidebar">
      {sorted.map((lesson) => (
        <button
          key={lesson.id}
          type="button"
          className={`lesson-sidebar__card ${lesson.id === activeLessonId ? 'lesson-sidebar__card--active' : ''}`}
          onClick={() => onSelectLesson(lesson.id)}
        >
          <img
            src={lesson.thumbnailUrl || '/nen.png'}
            alt={lesson.title}
            className="lesson-sidebar__thumbnail"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/nen.png';
            }}
          />
          <div className="lesson-sidebar__info">
            <h4 className="lesson-sidebar__title">{lesson.title}</h4>
            {lesson.duration > 0 && (
              <div className="lesson-sidebar__duration">
                <Clock size={14} />
                <span>{formatDuration(lesson.duration)}</span>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function LessonDetailPage() {
  const { moduleId } = useParams<{ moduleId: string }>();

  const [module, setModule] = useState<LearnModule | null>(null);
  const [activeLesson, setActiveLesson] = useState<LearnLesson | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Step 2: Fetch module by ID ----
  useEffect(() => {
    const id = Number(moduleId);
    if (!id || isNaN(id)) {
      setError('Module không hợp lệ.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getModuleById(id)
      .then((data) => {
        if (cancelled) return;
        setModule(data);
        // Default: chọn bài đầu tiên (orderIndex nhỏ nhất)
        const sortedLessons = [...(data.lessons ?? [])].sort(
          (a, b) => a.orderIndex - b.orderIndex,
        );
        if (sortedLessons.length > 0) {
          setActiveLessonId(sortedLessons[0].id);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err) || 'Không tải được module.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  // ---- Step 3 & 4: Fetch active lesson detail ----
  useEffect(() => {
    if (!activeLessonId) return;

    let cancelled = false;
    setLessonLoading(true);

    getLessonById(activeLessonId)
      .then((data) => {
        if (!cancelled) setActiveLesson(data);
      })
      .catch((err) => {
        if (!cancelled) console.error('[LessonDetail] Lesson fetch error:', err);
      })
      .finally(() => {
        if (!cancelled) setLessonLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeLessonId]);

  // ---- Derived data ----
  const sortedLessons = module
    ? [...(module.lessons ?? [])].sort((a, b) => a.orderIndex - b.orderIndex)
    : [];
  const currentIndex = sortedLessons.findIndex((l) => l.id === activeLessonId);
  const totalLessons = sortedLessons.length;
  const progressPercent =
    totalLessons > 0 ? ((currentIndex + 1) / totalLessons) * 100 : 0;

  // ---- Step 4: Switch lesson without page reload ----
  const handleLessonSelect = (lessonId: number) => {
    if (lessonId === activeLessonId) return;
    setActiveLessonId(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------------------------------------------------------------------------
  // Loading / Error
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="lesson-detail-page">
        <div className="lesson-detail-page__container">
          <p className="lesson-detail-page__loading">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="lesson-detail-page">
        <div className="lesson-detail-page__container">
          <Breadcrumbs items={[{ label: 'Học nhanh', path: '/learn' }, { label: 'Lỗi' }]} />
          <div className="lesson-detail-page__error">
            <p>{error || 'Không tìm thấy module.'}</p>
            <a href="/learn" style={{ color: '#8B0000', fontWeight: 600 }}>
              ← Quay lại danh sách
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Parse data
  // ---------------------------------------------------------------------------
  const contentSections = activeLesson
    ? parseSections(activeLesson.contentJson ?? '')
    : [];
  const vocabulary = activeLesson
    ? parseVocabulary(activeLesson.vocabularyJson ?? '')
    : [];
  const objectives = activeLesson?.objectiveText
    ? [activeLesson.objectiveText]
    : [];
  const quickNotes = parseQuickNotes(module.quickNotesJson ?? '');

  const breadcrumbItems = [
    { label: 'Học nhanh', path: '/learn' },
    { label: module.categoryName || 'Bài học' },
    { label: activeLesson?.title || module.title },
  ];

  const heroImageUrl =
    activeLesson?.imageUrl || module.thumbnailUrl || '';
  const hasVideo = !!activeLesson?.videoUrl;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="lesson-detail-page">
      <div className="lesson-detail-page__container">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero: Video hoặc Image */}
        {hasVideo ? (
          <div className="lesson-detail-page__video">
            <video
              key={activeLesson?.videoUrl}
              controls
              poster={activeLesson?.imageUrl || module.thumbnailUrl || ''}
              className="lesson-detail-page__video-player"
            >
              <source src={activeLesson!.videoUrl} type="video/mp4" />
            </video>
          </div>
        ) : (
          <LessonHero
            imageUrl={heroImageUrl}
            alt={activeLesson?.title || module.title}
          />
        )}

        {/* Header */}
        <LessonHeader
          title={activeLesson?.title || module.title}
          authorName={
            activeLesson?.author?.fullName ||
            module.categoryName ||
            'Học nhanh'
          }
          authorAvatar={activeLesson?.author?.profileImageUrl}
          viewCount={activeLesson?.viewsCount}
        />

        {/* Objectives + Progress bar */}
        {(objectives.length > 0 || totalLessons > 0) && (
          <div className="lesson-detail-page__objectives-row">
            {objectives.length > 0 && (
              <LessonObjectives objectives={objectives} />
            )}
            {totalLessons > 0 && (
              <div className="lesson-detail-page__progress-info">
                <span className="lesson-detail-page__progress-label">
                  Tiến độ: {currentIndex + 1}/{totalLessons} bài
                </span>
                <div className="lesson-detail-page__progress-bar">
                  <div
                    className="lesson-detail-page__progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content: Tóm tắt nội dung (trái) + Từ vựng & Khái niệm (phải) */}
        {lessonLoading ? (
          <div className="lesson-detail-page__content">
            <p className="lesson-detail-page__loading">Đang tải bài học...</p>
          </div>
        ) : (
          <div className="lesson-detail-page__content">
            <div className="lesson-detail-page__main">
              {contentSections.length > 0 && (
                <LessonSummary sections={contentSections} />
              )}
            </div>
            <div className="lesson-detail-page__sidebar">
              {vocabulary.length > 0 && (
                <LessonVocabulary items={vocabulary} />
              )}
            </div>
          </div>
        )}

        {/* Quick Notes (trái) + Lesson sidebar (phải) */}
        <div className="lesson-detail-page__bottom">
          <div className="lesson-detail-page__bottom-left">
            {quickNotes.length > 0 && (
              <LessonQuickNotes
                notes={quickNotes}
                tip={
                  module.culturalEtiquetteTitle && module.culturalEtiquetteText
                    ? {
                        title: module.culturalEtiquetteTitle,
                        content: module.culturalEtiquetteText,
                      }
                    : undefined
                }
              />
            )}
          </div>
          <div className="lesson-detail-page__bottom-right">
            {sortedLessons.length > 1 && (
              <LessonSidebar
                lessons={sortedLessons.filter((l) => l.id !== activeLessonId)}
                activeLessonId={activeLessonId}
                onSelectLesson={handleLessonSelect}
              />
            )}
          </div>
        </div>

        {/* Quiz CTA */}
        {module.quizPrompt && (
          <LessonQuizCTA
            moduleId={module.id}
            questionCount={module.quizPrompt.totalQuestions}
            quizId={module.quizPrompt.id}
          />
        )}
      </div>
    </div>
  );
}
