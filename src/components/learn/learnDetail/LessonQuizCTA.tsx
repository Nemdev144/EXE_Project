import { useNavigate } from 'react-router-dom';
import '../../../styles/components/learnDetail/_lesson-quiz-cta.scss';

interface LessonQuizCTAProps {
  moduleId: number;
  questionCount?: number;
  /** Nếu có, navigate với state.quizId để QuizPage load đúng đề */
  quizId?: number;
}

export default function LessonQuizCTA({
  moduleId,
  questionCount = 5,
  quizId,
}: LessonQuizCTAProps) {
  const navigate = useNavigate();

  const goToQuiz = () => {
    navigate(`/learn/${moduleId}/quiz`, { state: { quizId } });
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
