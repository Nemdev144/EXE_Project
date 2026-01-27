import { Link } from 'react-router-dom';
import type { LessonGroup } from './LearnPageContent';
import '../../styles/components/_lesson-card.scss';

interface LessonCardProps {
  lesson: LessonGroup;
}

export default function LessonCard({ lesson }: LessonCardProps) {
  const lessonUrl = `/learn/${lesson.category.toLowerCase().replace(/\s+/g, '-')}/${lesson.slug}`;

  return (
    <Link to={lessonUrl} className="lesson-card">
      <div className="lesson-card__image">
        <img src={lesson.thumbnailUrl} alt={lesson.title} />
      </div>
      <div className="lesson-card__content">
        <h3 className="lesson-card__title">{lesson.title}</h3>
        <div className="lesson-card__meta">
          <span className="lesson-card__count">{lesson.lessonCount} bài</span>
          <span className="lesson-card__duration">{lesson.totalDuration} phút</span>
        </div>
        <div className="lesson-card__progress">
          <div className="lesson-card__progress-bar" />
        </div>
        <div className="lesson-card__button">
          Học ngay
        </div>
      </div>
    </Link>
  );
}
