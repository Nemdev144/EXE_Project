import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
import { getModuleById, getLessonById, getApiErrorMessage } from '../../services/api';
import type { LearnModule, LearnLesson } from '../../types';
import '../../styles/pages/_lesson-detail.scss';

function parseQuickNotes(json: string): string[] {
  if (!json || json.trim() === '') return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function parseVocabulary(json: string): { term: string; definition: string }[] {
  if (!json || json.trim() === '') return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is { term?: string; definition?: string } => x != null && typeof x === 'object')
      .map((x) => ({ term: x.term ?? '', definition: x.definition ?? '' }))
      .filter((x) => x.term || x.definition);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// View: Single lesson (GET /api/learn/public/lessons/{id})
// ---------------------------------------------------------------------------
function LessonView({
  lesson,
  module,
}: {
  lesson: LearnLesson;
  module: LearnModule | null;
}) {
  const categorySlug = lesson.categoryName?.toLowerCase().replace(/\s+/g, '-') ?? '';
  const vocabulary = parseVocabulary(lesson.vocabularyJson ?? '');
  const objectives = lesson.objectiveText ? [lesson.objectiveText] : [];

  const relatedLessons = (module?.lessons ?? [])
    .filter((l) => l.id !== lesson.id)
    .map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.duration ? `${Math.floor(l.duration / 60)}:${String(l.duration % 60).padStart(2, '0')}` : '0:00',
      thumbnailUrl: l.thumbnailUrl ?? '',
      slug: l.slug,
      category: categorySlug,
    }));

  const breadcrumbItems = [
    { label: 'Học nhanh', path: '/learn' },
    { label: lesson.moduleTitle || lesson.categoryName || 'Bài học', path: `/learn/${categorySlug}` },
    { label: lesson.title },
  ];

  const isHtml = lesson.contentJson?.trim().startsWith('<');

  return (
    <div className="lesson-detail-page">
      <div className="lesson-detail-page__container">
        <Breadcrumbs items={breadcrumbItems} />

        <LessonHero
          imageUrl={lesson.imageUrl || ''}
          alt={lesson.title}
        />

        <LessonHeader
          title={lesson.title}
          authorName={lesson.author?.fullName ?? lesson.categoryName ?? 'Học nhanh'}
          authorAvatar={lesson.author?.profileImageUrl}
          viewCount={lesson.viewsCount}
        />

        <div className="lesson-detail-page__content">
          <div className="lesson-detail-page__main">
            {objectives.length > 0 && (
              <LessonObjectives objectives={objectives} />
            )}
            {lesson.contentJson && (
              <div className="lesson-detail-page__body">
                {isHtml ? (
                  <div
                    className="lesson-detail-page__html"
                    dangerouslySetInnerHTML={{ __html: lesson.contentJson }}
                  />
                ) : (
                  <p className="lesson-detail-page__text">{lesson.contentJson}</p>
                )}
              </div>
            )}
          </div>

          <div className="lesson-detail-page__sidebar">
            {vocabulary.length > 0 && (
              <LessonVocabulary items={vocabulary} />
            )}
            {relatedLessons.length > 0 && (
              <LessonRelated lessons={relatedLessons} />
            )}
          </div>
        </div>

        {module?.quizPrompt && (
          <LessonQuizCTA
            category={categorySlug}
            slug={lesson.slug}
            questionCount={module.quizPrompt.totalQuestions}
            quizId={module.quizPrompt.id}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// View: Module (GET /api/learn/public/modules/{id})
// ---------------------------------------------------------------------------
function ModuleView({ module }: { module: LearnModule }) {
  const categorySlug = module.categoryName?.toLowerCase().replace(/\s+/g, '-') ?? '';
  const quickNotes = parseQuickNotes(module.quickNotesJson ?? '');
  const summarySection =
    module.culturalEtiquetteTitle || module.culturalEtiquetteText
      ? [
          {
            title: module.culturalEtiquetteTitle || 'Văn hóa ứng xử',
            content: module.culturalEtiquetteText || '',
          },
        ]
      : [];
  const relatedLessons = (module.lessons ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    duration: l.duration ? `${Math.floor(l.duration / 60)}:${String(l.duration % 60).padStart(2, '0')}` : '0:00',
    thumbnailUrl: l.thumbnailUrl ?? '',
    slug: l.slug,
    category: categorySlug,
  }));

  const breadcrumbItems = [
    { label: 'Học nhanh', path: '/learn' },
    { label: module.categoryName || 'Bài học', path: `/learn/${categorySlug}` },
    { label: module.title },
  ];

  return (
    <div className="lesson-detail-page">
      <div className="lesson-detail-page__container">
        <Breadcrumbs items={breadcrumbItems} />

        <LessonHero imageUrl={module.thumbnailUrl || ''} alt={module.title} />

        <LessonHeader
          title={module.title}
          authorName={module.categoryName || 'Học nhanh'}
        />

        <div className="lesson-detail-page__content">
          <div className="lesson-detail-page__main">
            {summarySection.length > 0 && (
              <LessonSummary sections={summarySection} />
            )}
          </div>

          <div className="lesson-detail-page__sidebar">
            {relatedLessons.length > 0 && (
              <LessonRelated lessons={relatedLessons} />
            )}
          </div>
        </div>

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

        <LessonQuizCTA
          category={categorySlug}
          slug={module.slug}
          questionCount={module.quizPrompt?.totalQuestions}
          quizId={module.quizPrompt?.id}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function LessonDetailPage() {
  const { category } = useParams<{ category: string; slug: string }>();
  const location = useLocation();
  const state = location.state as { moduleData?: LearnModule; moduleId?: number; lessonId?: number } | undefined;
  const moduleData = state?.moduleData ?? null;
  const moduleId = state?.moduleId;
  const lessonId = state?.lessonId;

  const [lesson, setLesson] = useState<LearnLesson | null>(null);
  const [module, setModule] = useState<LearnModule | null>(moduleData);
  const [loading, setLoading] = useState(!moduleData && !!(moduleId || lessonId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have module data from route state, no need to fetch
    if (moduleData) return;

    if (lessonId) {
      let cancelled = false;
      getLessonById(lessonId)
        .then((data) => {
          if (!cancelled) setLesson(data);
        })
        .catch((err) => {
          if (!cancelled) setError(getApiErrorMessage(err) || 'Không tải được bài học.');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => { cancelled = true; };
    }

    if (moduleId) {
      let cancelled = false;
      getModuleById(moduleId)
        .then((data) => {
          if (!cancelled) setModule(data);
        })
        .catch((err) => {
          if (!cancelled) setError(getApiErrorMessage(err) || 'Không tải được nội dung bài học.');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => { cancelled = true; };
    }

    setLoading(false);
    return undefined;
  }, [lessonId, moduleId, moduleData]);

  useEffect(() => {
    if (!lesson?.moduleId || module != null) return;
    let cancelled = false;
    getModuleById(lesson.moduleId)
      .then((data) => {
        if (!cancelled) setModule(data);
      })
      .catch(() => {})
      .finally(() => {});
    return () => { cancelled = true; };
  }, [lesson?.moduleId, module]);

  if (loading) {
    return (
      <div className="lesson-detail-page">
        <div className="lesson-detail-page__container">
          <p className="lesson-detail-page__loading">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lesson-detail-page">
        <div className="lesson-detail-page__container">
          <p className="lesson-detail-page__error">{error}</p>
        </div>
      </div>
    );
  }

  if (lesson) {
    return <LessonView lesson={lesson} module={module} />;
  }

  if (module) {
    return <ModuleView module={module} />;
  }

  return (
    <div className="lesson-detail-page">
      <div className="lesson-detail-page__container">
        <p className="lesson-detail-page__error">Vui lòng chọn bài học từ trang Học nhanh.</p>
      </div>
    </div>
  );
}
