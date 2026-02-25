import '../../styles/components/tourBookingscss/_contact-form.scss';

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface ContactFormProps {
  value: ContactInfo;
  onChange: (info: ContactInfo) => void;
}

export default function ContactForm({ value, onChange }: ContactFormProps) {
  const handleChange = (field: keyof ContactInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({ ...value, [field]: e.target.value });
  };

  return (
    <div className="contact-form">
      <h2 className="contact-form__heading">Thông tin liên hệ</h2>

      <div className="contact-form__group">
        <label className="contact-form__label">
          Họ và tên <span className="contact-form__required">*</span>
        </label>
        <input
          type="text"
          className="contact-form__input"
          placeholder="Nguyen Van A"
          value={value.fullName}
          onChange={handleChange('fullName')}
        />
      </div>

      <div className="contact-form__group">
        <label className="contact-form__label">
          Email <span className="contact-form__required">*</span>
        </label>
        <input
          type="email"
          className="contact-form__input"
          placeholder="nguyenvana@gmail.com"
          value={value.email}
          onChange={handleChange('email')}
        />
      </div>

      <div className="contact-form__group">
        <label className="contact-form__label">
          Số điện thoại <span className="contact-form__required">*</span>
        </label>
        <div className="contact-form__phone-wrapper">
          <span className="contact-form__phone-prefix">+84</span>
          <input
            type="tel"
            className="contact-form__input contact-form__input--phone"
            placeholder="0123456789"
            value={value.phone}
            onChange={handleChange('phone')}
          />
        </div>
      </div>
    </div>
  );
}
