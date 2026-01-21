import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    username: "",
    cccd: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng ký ở đây
    console.log("Register data:", formData);
  };

  // Ẩn scrollbar của body khi ở trang register
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="register-page">
      {/* LEFT FORM - 40% width */}
      <div className="register-page__form-container">
        <div className="register-page__form-wrapper">
          {/* TITLE */}
          <h1 className="register-page__title">
            Đăng Ký
          </h1>
          <p className="register-page__subtitle">
            Bạn đã sẵn sàng trở thành thành viên của câu lạc bộ đặc quyền này
            chưa? Hãy điền thông tin bên dưới và bắt đầu hành trình thôi!
          </p>

          <form onSubmit={handleSubmit} className="register-page__form">
            {/* Hàng 1: Tên đầy đủ và Ngày sinh */}
            <div className="register-page__row">
              <div className="register-page__field">
                <label
                  htmlFor="fullName"
                  className="register-page__label"
                >
                  Tên đầy đủ
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="register-page__input"
                  placeholder="Tên đầy đủ"
                />
              </div>
              <div className="register-page__field">
                <label
                  htmlFor="dateOfBirth"
                  className="register-page__label"
                >
                  Ngày sinh
                </label>
                <input
                  type="text"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="register-page__input"
                  placeholder="Ngày/Tháng/Năm"
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="register-page__field">
              <label
                htmlFor="phone"
                className="register-page__label"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="register-page__input"
                placeholder="Số điện thoại"
              />
            </div>

            {/* Tên đăng nhập */}
            <div className="register-page__field">
              <label
                htmlFor="username"
                className="register-page__label"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="register-page__input"
                placeholder="Tên đăng nhập"
              />
            </div>

            {/* CCCD */}
            <div className="register-page__field">
              <label
                htmlFor="cccd"
                className="register-page__label"
              >
                CCCD <span className="register-page__required">*</span>
              </label>
              <input
                type="text"
                id="cccd"
                name="cccd"
                value={formData.cccd}
                onChange={handleChange}
                className="register-page__input"
                placeholder="Số CCCD"
                required
              />
            </div>

            {/* Email */}
            <div className="register-page__field">
              <label
                htmlFor="email"
                className="register-page__label"
              >
                Email <span className="register-page__required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="register-page__input"
                placeholder="Email"
                required
              />
            </div>

            {/* Mật khẩu */}
            <div className="register-page__field">
              <label
                htmlFor="password"
                className="register-page__label"
              >
                Mật khẩu <span className="register-page__required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="register-page__input"
                placeholder="Mật khẩu"
                required
              />
            </div>

            {/* Xác thực mật khẩu */}
            <div className="register-page__field">
              <label
                htmlFor="confirmPassword"
                className="register-page__label"
              >
                Xác thực mật khẩu <span className="register-page__required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="register-page__input"
                placeholder="Xác thực mật khẩu"
                required
              />
            </div>

            {/* Nút Đăng ký */}
            <button
              type="submit"
              className="register-page__submit-button"
            >
              Đăng ký
            </button>

            {/* Link đăng nhập */}
            <p className="register-page__login-link">
              Bạn đã có tài khoản?{" "}
              <Link to="/login">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT IMAGE - 60% width - Large image container */}
      <div className="register-page__image-container">
        <img
          src="/anhlogin.png"
          alt="Vietnam Culture"
          className="register-page__image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.error("Failed to load image:", target.src);
          }}
        />
      </div>
    </div>
  );
};

export default Register;
