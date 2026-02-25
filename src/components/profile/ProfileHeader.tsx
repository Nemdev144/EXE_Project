import { useRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  LogOut,
} from 'lucide-react';
import type { UserProfile } from '../../services/profileApi';
import '../../styles/components/profile/_profile-header.scss';

interface ProfileHeaderProps {
  user: UserProfile;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  onAvatarChange: (file: File) => void;
}

function getMembershipLabel(_user: UserProfile): string {
  return 'Thành viên';
}

function getInitials(name: string): string {
  if (!name) return 'KH';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function ProfileHeader({
  user,
  onEditProfile,
  onChangePassword,
  onLogout,
  onAvatarChange,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAvatarChange(file);
  };

  return (
    <div className="profile-header">
      <div className="profile-header__left">
        {/* Avatar */}
        <div className="profile-header__avatar" onClick={handleAvatarClick}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="profile-header__avatar-img"
            />
          ) : (
            <div className="profile-header__avatar-placeholder">
              {getInitials(user.fullName)}
            </div>
          )}
          <div className="profile-header__avatar-overlay">
            <Camera size={18} />
            <span>Đổi ảnh</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>

        {/* Info */}
        <div className="profile-header__info">
          <h1 className="profile-header__name">{user.fullName}</h1>
          <span className="profile-header__badge">{getMembershipLabel(user)}</span>

          <div className="profile-header__meta">
            <span className="profile-header__meta-item">
              <Mail size={14} /> {user.email}
            </span>
            {user.phone && (
              <span className="profile-header__meta-item">
                <Phone size={14} /> {user.phone}
              </span>
            )}
            <span className="profile-header__meta-item">
              <MapPin size={14} /> Việt Nam
            </span>
            <span className="profile-header__meta-item">
              <Globe size={14} /> Tiếng Việt
            </span>
          </div>

          <div className="profile-header__actions">
            <button
              className="profile-header__btn profile-header__btn--outline"
              onClick={onEditProfile}
            >
              Chỉnh sửa hồ sơ
            </button>
            <button
              className="profile-header__btn profile-header__btn--outline"
              onClick={onChangePassword}
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}
