import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import {
  QuizResultBanner,
  QuizResultSummary,
  QuizExplanationCard,
  RelatedTours,
} from '../../components/learn';
import type { LearnQuizQuestion } from '../../types';
import '../../styles/pages/_quiz-results.scss';

interface QuizResultsState {
  quizId?: number;
  quizTitle?: string;
  questions?: LearnQuizQuestion[];
  selectedAnswers?: Record<number, number>;
  timeSpent?: number;
}

export default function QuizResultsPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as QuizResultsState | undefined;
  const questions = state?.questions ?? [];
  const selectedAnswers = state?.selectedAnswers ?? {};
  const timeSpent = state?.timeSpent ?? 0;

  useEffect(() => {
    if (!questions.length) {
      navigate(`/learn/${moduleId ?? ''}`, { replace: true });
    }
  }, [questions.length, moduleId, navigate]);

  const totalCount = questions.length;
  const hasCorrectFromApi = questions.some(
    (q) => q.options?.some((o) => o.isCorrect === true)
  );
  const correctCount = hasCorrectFromApi
    ? questions.filter((q) => {
        const idx = selectedAnswers[q.id];
        return idx !== undefined && q.options?.[idx]?.isCorrect === true;
      }).length
    : undefined;
  const percentage =
    totalCount > 0 && correctCount !== undefined
      ? Math.round((correctCount / totalCount) * 100)
      : undefined;

  const relatedTours = [
    {
      id: 1,
      title: 'Rừng thông và thác nước Măng Đen',
      description: 'Khám phá vẻ đẹp thiên nhiên hoang sơ của Tây Nguyên với rừng thông xanh mướt và những thác nước hùng vĩ.',
      price: '2.500.000VND',
      thumbnailUrl: '/home/slider/1.jpg',
    },
    {
      id: 2,
      title: 'Nhà rông và làng cổ Kom Tum',
      description: 'Trải nghiệm văn hóa đặc sắc tại nhà rông truyền thống và các làng cổ của người Ba Na.',
      price: '1.800.000VND',
      thumbnailUrl: '/home/slider/2.jpg',
    },
    {
      id: 3,
      title: 'Cồng Chiêng và cà phê Đắk Lắk',
      description: 'Thưởng thức cà phê đặc sản và tham gia các buổi biểu diễn cồng chiêng độc đáo.',
      price: '3.200.000VND',
      thumbnailUrl: '/home/slider/3.jpg',
    },
  ];

  const breadcrumbItems = [
    { label: 'Học nhanh', path: '/learn' },
    { label: 'Bài học', path: `/learn/${moduleId ?? ''}` },
    { label: 'Kết quả Quiz' },
  ];

  if (!questions.length) {
    return null;
  }

  return (
    <div className="quiz-results-page">
      <div className="quiz-results-page__container">
        <Breadcrumbs items={breadcrumbItems} />

        <QuizResultBanner
          correctCount={correctCount}
          totalCount={totalCount}
          percentage={percentage}
          submittedOnly={correctCount === undefined}
        />

        <div className="quiz-results-page__content">
          <div className="quiz-results-page__main">
            <h2 className="quiz-results-page__section-title">
              Đáp án bạn chọn
            </h2>

            {questions.map((question, index) => {
              const optionTexts = question.options?.map((o) => o.optionText) ?? [];
              const correctIndex =
                question.options?.findIndex((o) => o.isCorrect === true) ?? -1;

              return (
                <QuizExplanationCard
                  key={question.id}
                  questionNumber={index + 1}
                  questionText={question.questionText}
                  options={optionTexts}
                  selectedAnswer={selectedAnswers[question.id]}
                  correctAnswer={correctIndex >= 0 ? correctIndex : undefined}
                  explanation={undefined}
                />
              );
            })}
          </div>

          <div className="quiz-results-page__sidebar">
            <QuizResultSummary
              score={percentage}
              timeSpent={timeSpent}
              correctCount={correctCount}
              totalCount={totalCount}
              retakeUrl={`/learn/${moduleId}/quiz${state?.quizId ? `?quizId=${state.quizId}` : ''}`}
              backUrl={`/learn/${moduleId}`}
            />
          </div>
        </div>

        <RelatedTours tours={relatedTours} />
      </div>
    </div>
  );
}
