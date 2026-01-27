import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import '../../styles/components/learn/_lesson-related.scss';

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

export default function LessonRelated({ lessons }: LessonRelatedProps) {
  return (
    <div className="lesson-related">
      <h2 className="lesson-related__title">Bài học liên quan</h2>
      <div className="lesson-related__list">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/learn/${lesson.category}/${lesson.slug}`}
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
