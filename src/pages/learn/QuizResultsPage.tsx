import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import {
  QuizResultBanner,
  QuizResultSummary,
  QuizExplanationCard,
  RelatedTours,
} from '../../components/learn';
import '../../styles/pages/_quiz-results.scss';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizResultsProps {
  questions?: Question[];
  selectedAnswers?: Record<number, number>;
  timeSpent?: number;
}

export default function QuizResultsPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as QuizResultsProps;
  const questions = state?.questions || [];
  const selectedAnswers = state?.selectedAnswers || {};
  const timeSpent = state?.timeSpent || 0;

  useEffect(() => {
    if (!questions.length) {
      navigate(`/learn/${category}/${slug}`);
    }
  }, [questions, category, slug, navigate]);

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const score = calculateScore();

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
    { label: category || 'Cồng chiêng', path: `/learn/${category}` },
    { label: 'Kết quả Quiz' },
  ];

  return (
    <div className="quiz-results-page">
      <div className="quiz-results-page__container">
        <Breadcrumbs items={breadcrumbItems} />

        <QuizResultBanner
          correctCount={score.correct}
          totalCount={score.total}
          percentage={score.percentage}
        />

        <div className="quiz-results-page__content">
          <div className="quiz-results-page__main">
            <h2 className="quiz-results-page__section-title">
              Giải thích & Kết quả chi tiết
            </h2>

            {questions.map((question, index) => (
              <QuizExplanationCard
                key={question.id}
                questionNumber={index + 1}
                question={question.question}
                options={question.options}
                correctAnswer={question.correctAnswer}
                selectedAnswer={selectedAnswers[question.id]}
                explanation={question.explanation}
              />
            ))}
          </div>

          <div className="quiz-results-page__sidebar">
            <QuizResultSummary
              score={score.percentage}
              timeSpent={timeSpent}
              correctCount={score.correct}
              totalCount={score.total}
              retakeUrl={`/learn/${category}/${slug}/quiz`}
              backUrl={`/learn/${category}/${slug}`}
            />
          </div>
        </div>

        <RelatedTours tours={relatedTours} />
      </div>
    </div>
  );
}
