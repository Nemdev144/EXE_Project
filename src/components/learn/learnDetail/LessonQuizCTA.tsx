import { useNavigate } from 'react-router-dom';
import '../../../styles/components/learnDetail/_lesson-quiz-cta.scss';

interface LessonQuizCTAProps {
  category: string;
  slug: string;
  questionCount?: number;
  /** Nếu có, navigate với state.quizId để QuizPage load đúng đề */
  quizId?: number;
}

export default function LessonQuizCTA({
  category,
  slug,
  questionCount = 5,
  quizId,
}: LessonQuizCTAProps) {
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
      <button className="lesson-quiz-cta__button" onClick={goToQuiz}>
        Làm Quiz ngay
      </button>
    </div>
  );
}
