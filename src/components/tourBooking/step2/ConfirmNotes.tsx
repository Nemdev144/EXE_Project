import '../../../styles/components/tourBookingscss/step2/_confirm-notes.scss';

interface ConfirmNotesProps {
  notes: string;
  specialRequirements: string;
}

export default function ConfirmNotes({ notes, specialRequirements }: ConfirmNotesProps) {
  const displayText = [specialRequirements, notes].filter(Boolean).join('. ') || 'Không có ghi chú.';

  return (
    <div className="confirm-notes">
      <div className="confirm-notes__label">
        <span className="confirm-notes__label-icon">📝</span>
        Ghi chú / yêu cầu đặc biệt
      </div>

      <div className="confirm-notes__box">
        <p>{displayText}</p>
      </div>
    </div>
  );
}
