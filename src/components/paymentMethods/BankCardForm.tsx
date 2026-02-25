import { CreditCard, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import '../../styles/components/paymentMethodscss/_bank-card-form.scss';

export interface BankCardData {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

interface BankCardFormProps {
  value: BankCardData;
  onChange: (data: BankCardData) => void;
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export default function BankCardForm({ value, onChange }: BankCardFormProps) {
  const [showCvv, setShowCvv] = useState(false);

  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    onChange({ ...value, cardNumber: digits });
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    onChange({ ...value, expiryDate: digits });
  };

  const handleCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    onChange({ ...value, cvv: digits });
  };

  return (
    <div className="bank-card-form">
      {/* Card Number */}
      <div className="bank-card-form__group">
        <label className="bank-card-form__label">Số thẻ</label>
        <div className="bank-card-form__input-wrapper">
          <input
            type="text"
            className="bank-card-form__input"
            placeholder="1234 5678 9012 3456"
            value={formatCardNumber(value.cardNumber)}
            onChange={handleCardNumber}
            inputMode="numeric"
            autoComplete="cc-number"
          />
          <CreditCard size={18} className="bank-card-form__icon" />
        </div>
      </div>

      {/* Card Holder Name */}
      <div className="bank-card-form__group">
        <label className="bank-card-form__label">Tên chủ thẻ</label>
        <input
          type="text"
          className="bank-card-form__input"
          placeholder="NGUYEN VAN A"
          value={value.cardHolderName}
          onChange={(e) => onChange({ ...value, cardHolderName: e.target.value.toUpperCase() })}
          autoComplete="cc-name"
        />
      </div>

      {/* Expiry + CVV */}
      <div className="bank-card-form__row">
        <div className="bank-card-form__group bank-card-form__group--half">
          <label className="bank-card-form__label">Ngày hết hạn</label>
          <input
            type="text"
            className="bank-card-form__input"
            placeholder="MM/YY"
            value={formatExpiry(value.expiryDate)}
            onChange={handleExpiry}
            inputMode="numeric"
            autoComplete="cc-exp"
          />
        </div>

        <div className="bank-card-form__group bank-card-form__group--half">
          <label className="bank-card-form__label">CVV</label>
          <div className="bank-card-form__input-wrapper">
            <input
              type={showCvv ? 'text' : 'password'}
              className="bank-card-form__input"
              placeholder="123"
              value={value.cvv}
              onChange={handleCvv}
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
            />
            <button
              type="button"
              className="bank-card-form__toggle-cvv"
              onClick={() => setShowCvv(!showCvv)}
              tabIndex={-1}
            >
              {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Save card + security note */}
      <div className="bank-card-form__footer">
        <label className="bank-card-form__save-label">
          <input
            type="checkbox"
            checked={value.saveCard}
            onChange={(e) => onChange({ ...value, saveCard: e.target.checked })}
          />
          <span>Lưu thẻ cho lần sau</span>
        </label>
        <span className="bank-card-form__secure-note">
          Thanh toán an toàn - 3D Secure
        </span>
      </div>
    </div>
  );
}
