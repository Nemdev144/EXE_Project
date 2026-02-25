import { useState } from 'react';
import { X, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { message } from 'antd';
import { changePassword } from '../../../services/profileApi';
import '../../../styles/components/profile/changePassscss/_change-password.scss';

interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePassword({ open, onClose }: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
    setError('');
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  /* Validation */
  const validate = (): string | null => {
    if (!oldPassword.trim()) return 'Vui lòng nhập mật khẩu hiện tại.';
    if (newPassword.length < 6) return 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    if (newPassword !== confirmPassword) return 'Xác nhận mật khẩu không khớp.';
    if (oldPassword === newPassword) return 'Mật khẩu mới phải khác mật khẩu hiện tại.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      setSuccess(true);
      message.success('Đổi mật khẩu thành công!');
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const errMsg =
        axiosErr?.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      setError(errMsg);
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  /* Password strength */
  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0-5
  };

  const strength = getStrength(newPassword);
  const strengthLabel = ['', 'Yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'][strength] || '';
  const strengthCls = ['', 'weak', 'weak', 'medium', 'strong', 'very-strong'][strength] || '';

  return (
    <div className="change-password-overlay" onClick={handleClose}>
      <div className="change-password" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="change-password__header">
          <div className="change-password__header-icon">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="change-password__title">Đổi mật khẩu</h2>
            <p className="change-password__subtitle">
              Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
            </p>
          </div>
          <button className="change-password__close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Success */}
        {success && (
          <div className="change-password__success">
            <ShieldCheck size={18} />
            Đổi mật khẩu thành công!
          </div>
        )}

        {/* Error */}
        {error && <div className="change-password__error">{error}</div>}

        {/* Form */}
        <form className="change-password__form" onSubmit={handleSubmit}>
          {/* Old password */}
          <div className="change-password__field">
            <label className="change-password__label">Mật khẩu hiện tại</label>
            <div className="change-password__input-wrap">
              <Lock size={16} className="change-password__input-icon" />
              <input
                type={showOld ? 'text' : 'password'}
                className="change-password__input"
                placeholder="Nhập mật khẩu hiện tại"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="change-password__toggle"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="change-password__field">
            <label className="change-password__label">Mật khẩu mới</label>
            <div className="change-password__input-wrap">
              <Lock size={16} className="change-password__input-icon" />
              <input
                type={showNew ? 'text' : 'password'}
                className="change-password__input"
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="change-password__toggle"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength bar */}
            {newPassword.length > 0 && (
              <div className="change-password__strength">
                <div className="change-password__strength-bar">
                  <div
                    className={`change-password__strength-fill change-password__strength-fill--${strengthCls}`}
                    style={{ width: `${(strength / 5) * 100}%` }}
                  />
                </div>
                <span className={`change-password__strength-label change-password__strength-label--${strengthCls}`}>
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="change-password__field">
            <label className="change-password__label">Xác nhận mật khẩu mới</label>
            <div className="change-password__input-wrap">
              <Lock size={16} className="change-password__input-icon" />
              <input
                type={showConfirm ? 'text' : 'password'}
                className="change-password__input"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="change-password__toggle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <span className="change-password__mismatch">Mật khẩu không khớp</span>
            )}
          </div>

          {/* Actions */}
          <div className="change-password__actions">
            <button
              type="button"
              className="change-password__btn change-password__btn--cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="change-password__btn change-password__btn--submit"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
