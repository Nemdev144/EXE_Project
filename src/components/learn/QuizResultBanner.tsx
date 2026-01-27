import { CheckCircle } from 'lucide-react';
import '../../styles/components/learn/_quiz-result-banner.scss';

interface QuizResultBannerProps {
  correctCount: number;
  totalCount: number;
  percentage: number;
}

export default function QuizResultBanner({
  correctCount,
  totalCount,
  percentage,
}: QuizResultBannerProps) {
  return (
    <div className="quiz-result-banner">
      <div className="quiz-result-banner__icon">
        <CheckCircle size={48} />
      </div>
      <h1 className="quiz-result-banner__title">
        Chúc mừng! Bạn đạt {correctCount}/{totalCount} câu ({percentage}%)
      </h1>
      <p className="quiz-result-banner__subtitle">
        Cảm ơn bạn đã tham gia Quiz. Xem giải thích và gợi ý tour bên dưới.
      </p>
    </div>
  );
}
