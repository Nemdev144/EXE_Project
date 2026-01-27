import { useState } from 'react';
import { Pin } from 'lucide-react';
import '../../styles/components/learn/_quiz-question-card.scss';

interface QuizQuestionCardProps {
  questionNumber: number;
  question: string;
  options: string[];
  selectedAnswer?: number;
  onAnswerSelect: (answerIndex: number) => void;
  hint?: string;
  disabled?: boolean;
}

export default function QuizQuestionCard({
  questionNumber,
  question,
  options,
  selectedAnswer,
  onAnswerSelect,
  hint,
  disabled = false,
}: QuizQuestionCardProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="quiz-question-card">
      <div className="quiz-question-card__header">
        <h3 className="quiz-question-card__question">
          Câu {questionNumber}: {question}
        </h3>
      </div>

      <div className="quiz-question-card__options">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

          return (
            <button
              key={index}
              className={`quiz-question-card__option ${
                isSelected ? 'quiz-question-card__option--selected' : ''
              }`}
              onClick={() => !disabled && onAnswerSelect(index)}
              disabled={disabled}
            >
              <span className="quiz-question-card__option-label">{optionLabel}.</span>
              <span className="quiz-question-card__option-text">{option}</span>
            </button>
          );
        })}
      </div>

      {hint && (
        <div className="quiz-question-card__hint">
          <button
            className="quiz-question-card__hint-btn"
            onClick={() => setShowHint(!showHint)}
          >
            <Pin size={14} />
            <span>Xem gợi ý</span>
          </button>
          {showHint && (
            <div className="quiz-question-card__hint-content">{hint}</div>
          )}
        </div>
      )}
    </div>
  );
}
