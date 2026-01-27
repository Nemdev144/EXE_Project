import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import { QuizHeader, QuizQuestionCard, QuizSidebar } from '../../components/learn';
import '../../styles/pages/_quiz.scss';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  hint?: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: 'Cồng chiêng Tây Nguyên là nhạc cụ truyền thống của dân tộc nào?',
    options: ['Dân tộc Kinh', 'Dân tộc Ê-đê', 'Dân tộc Tày', 'Dân tộc Mường'],
    correctAnswer: 1,
    explanation: 'Cồng chiêng là nhạc cụ truyền thống đặc trưng của các dân tộc Tây Nguyên như Gia Rai, Ê Đê, Ba Na...',
    hint: 'Cồng chiêng là di sản văn hóa của các dân tộc vùng Tây Nguyên',
  },
  {
    id: 2,
    question: 'Cồng chiêng Tây Nguyên thường được sử dụng trong dịp nào?',
    options: ['Lễ hội', 'Đám cưới', 'Lễ mừng lúa mới', 'Tất cả các đáp án trên'],
    correctAnswer: 3,
    explanation: 'Cồng chiêng được sử dụng trong nhiều dịp quan trọng của cộng đồng Tây Nguyên.',
    hint: 'Cồng chiêng có vai trò quan trọng trong nhiều nghi lễ',
  },
  {
    id: 3,
    question: 'Số lượng chiếc trong một bộ cồng chiêng truyền thống thường là bao nhiêu?',
    options: ['3-5 chiếc', '6-12 chiếc', '15-20 chiếc', 'Không giới hạn'],
    correctAnswer: 1,
    explanation: 'Một dàn cồng chiêng thường có từ 6-12 chiếc, mỗi chiếc có âm thanh khác nhau.',
    hint: 'Một bộ cồng chiêng thường có số lượng từ 6 đến 12 chiếc',
  },
  {
    id: 4,
    question: 'Cồng chiêng Tây Nguyên được UNESCO công nhận là gì?',
    options: ['Di sản văn hóa vật thể', 'Di sản văn hóa phi vật thể', 'Di sản thiên nhiên', 'Di sản hỗn hợp'],
    correctAnswer: 1,
    explanation: 'Cồng chiêng Tây Nguyên được UNESCO công nhận là Di sản văn hóa phi vật thể của nhân loại năm 2005.',
    hint: 'UNESCO công nhận cồng chiêng là di sản văn hóa phi vật thể',
  },
  {
    id: 5,
    question: 'Chất liệu chính để làm cồng chiêng Tây Nguyên là gì?',
    options: ['Gỗ', 'Đồng', 'Sắt', 'Nhôm'],
    correctAnswer: 1,
    explanation: 'Cồng chiêng được làm từ đồng, một loại hợp kim có khả năng tạo ra âm thanh đặc trưng.',
    hint: 'Cồng chiêng được làm từ kim loại màu đỏ',
  },
];

export default function QuizPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();
  const [questions] = useState<Question[]>(sampleQuestions);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(120); // 2 phút = 120 giây
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    navigate(`/learn/${category}/${slug}/quiz/results`, {
      state: {
        questions,
        selectedAnswers,
        timeSpent: 120 - timeLeft,
      },
    });
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const canSubmit = answeredCount === questions.length;

  const breadcrumbItems = [
    { label: 'Học nhanh', path: '/learn' },
    { label: category || 'Cồng chiêng', path: `/learn/${category}` },
    { label: 'Quiz: 5 câu hỏi' },
  ];

  return (
    <div className="quiz-page">
      <div className="quiz-page__container">
        <Breadcrumbs items={breadcrumbItems} />

        <QuizHeader
          title="Không gian Cồng chiêng"
          questionCount={questions.length}
          duration={2}
          answeredCount={answeredCount}
        />

        <div className="quiz-page__content">
          <div className="quiz-page__questions">
            {questions.map((question, index) => (
              <QuizQuestionCard
                key={question.id}
                questionNumber={index + 1}
                question={question.question}
                options={question.options}
                selectedAnswer={selectedAnswers[question.id]}
                onAnswerSelect={(answerIndex) => handleAnswerSelect(question.id, answerIndex)}
                hint={question.hint}
                disabled={isSubmitted}
              />
            ))}
          </div>

          <QuizSidebar
            timeLeft={timeLeft}
            totalQuestions={questions.length}
            answeredCount={answeredCount}
            onSubmit={handleSubmit}
            backUrl={`/learn/${category}/${slug}`}
            canSubmit={canSubmit}
          />
        </div>
      </div>
    </div>
  );
}
