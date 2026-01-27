import { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import '../../styles/components/learn/_quiz-explanation-card.scss';

interface QuizExplanationCardProps {
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
  explanation?: string;
}

export default function QuizExplanationCard({
  questionNumber,
  question,
  options,
  correctAnswer,
  selectedAnswer,
  explanation,
}: QuizExplanationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className={`quiz-explanation-card ${isExpanded ? 'quiz-explanation-card--expanded' : ''}`}>
      <div
        className="quiz-explanation-card__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="quiz-explanation-card__status">
          {isCorrect ? (
            <CheckCircle size={24} className="quiz-explanation-card__icon--correct" />
          ) : (
            <XCircle size={24} className="quiz-explanation-card__icon--wrong" />
          )}
        </div>
        <div className="quiz-explanation-card__question">
          Câu {questionNumber}: {question}
        </div>
        <ChevronDown
          size={20}
          className={`quiz-explanation-card__chevron ${
            isExpanded ? 'quiz-explanation-card__chevron--expanded' : ''
          }`}
        />
      </div>

      {isExpanded && (
        <div className="quiz-explanation-card__content">
          <div className="quiz-explanation-card__correct-answer">
            <strong>Đáp án đúng:</strong>{' '}
            {String.fromCharCode(65 + correctAnswer)}.{' '}
            {options[correctAnswer]}
          </div>
          {selectedAnswer !== undefined && selectedAnswer !== correctAnswer && (
            <div className="quiz-explanation-card__your-answer">
              <strong>Bạn chọn:</strong>{' '}
              {String.fromCharCode(65 + selectedAnswer)}.{' '}
              {options[selectedAnswer]}
            </div>
          )}
          {explanation && (
            <div className="quiz-explanation-card__explanation">
              <strong>Giải thích:</strong> {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
