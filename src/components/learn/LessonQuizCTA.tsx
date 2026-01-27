import { useNavigate } from 'react-router-dom';
import '../../styles/components/learn/_lesson-quiz-cta.scss';

interface LessonQuizCTAProps {
  category: string;
  slug: string;
  questionCount?: number;
}

export default function LessonQuizCTA({ category, slug, questionCount = 5 }: LessonQuizCTAProps) {
  const navigate = useNavigate();

  return (
    <div className="lesson-quiz-cta">
      <h2 className="lesson-quiz-cta__title">Sẵn sàng kiểm tra kiến thức?</h2>
      <p className="lesson-quiz-cta__subtitle">
        Hoàn thành {questionCount} câu hỏi để củng cố kiến thức vừa học.
      </p>
      <button
        className="lesson-quiz-cta__button"
        onClick={() => navigate(`/learn/${category}/${slug}/quiz`)}
      >
        Làm Quiz ngay
      </button>
    </div>
  );
}
