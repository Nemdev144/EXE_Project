import { Check } from 'lucide-react';
import '../../styles/components/tourBookingscss/_booking-steps.scss';

interface Step {
  number: number;
  title: string;
  subtitle: string;
}

interface BookingStepsProps {
  currentStep: number;
}

const steps: Step[] = [
  { number: 1, title: 'Điền thông tin', subtitle: 'Đang thực hiện' },
  { number: 2, title: 'Xác nhận thông tin', subtitle: 'Chờ xử lý' },
  { number: 3, title: 'Thanh toán', subtitle: 'Chờ xử lý' },
  { number: 4, title: 'E-ticket', subtitle: 'Chờ xử lý' },
];

export default function BookingSteps({ currentStep }: BookingStepsProps) {
  return (
    <div className="booking-steps">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <div key={step.number} className="booking-steps__item-wrapper">
            <div
              className={`booking-steps__item ${
                isActive ? 'booking-steps__item--active' : ''
              } ${isCompleted ? 'booking-steps__item--completed' : ''}`}
            >
              <div className="booking-steps__circle">
                {isCompleted ? <Check size={16} /> : step.number}
              </div>
              <div className="booking-steps__info">
                <span className="booking-steps__title">{step.title}</span>
                <span className="booking-steps__subtitle">
                  {isActive ? 'Đang thực hiện' : isCompleted ? 'Hoàn tất' : step.subtitle}
                </span>
              </div>
            </div>
            {index < steps.length - 1 && <div className="booking-steps__connector" />}
          </div>
        );
      })}
    </div>
  );
}
