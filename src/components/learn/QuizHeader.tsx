import { BarChart3, Target, Clock } from 'lucide-react';
import '../../styles/components/learn/_quiz-header.scss';

interface QuizHeaderProps {
  title: string;
  questionCount: number;
  duration: number; // in minutes
  level?: string;
  objective?: string;
  answeredCount: number;
}

export default function QuizHeader({
  title,
  questionCount,
  duration,
  level = 'Cơ bản',
  objective = 'ôn khái niệm chính',
  answeredCount,
}: QuizHeaderProps) {
  const progress = (answeredCount / questionCount) * 100;

  return (
    <div className="quiz-header">
      <h1 className="quiz-header__title">
        Quiz: {title} ({questionCount} câu - {duration} phút)
      </h1>
      <div className="quiz-header__meta">
        <div className="quiz-header__meta-item">
          <BarChart3 size={16} />
          <span>Cấp độ: {level}</span>
        </div>
        <div className="quiz-header__meta-item">
          <Target size={16} />
          <span>Mục tiêu: {objective}</span>
        </div>
        <div className="quiz-header__meta-item">
          <Clock size={16} />
          <span>{duration.toString().padStart(2, '0')}:00</span>
        </div>
        <div className="quiz-header__meta-item">
          <span>Tiến độ {answeredCount}/{questionCount}</span>
          <div className="quiz-header__progress-bar">
            <div
              className="quiz-header__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
