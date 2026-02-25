import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Search } from 'lucide-react';

const navLinks = [
    { path: '/', label: 'Trang chủ' },
    { path: '/tours', label: 'Tours' },
    { path: '/artisans', label: 'Góc nghệ nhân' },
    { path: '/learn', label: 'Học nhanh' },
    { path: '/about', label: 'Về chúng tôi' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="layout-nav">
            <div className="layout-nav__container">
                <div className="layout-nav__inner">
                    {/* Logo */}
                    <Link to="/" className="layout-nav__logo">
                        <div className="layout-nav__logo-icon">
                            <span className="layout-nav__logo-letter">C</span>
                        </div>
                        <span className="layout-nav__logo-text">
                            Cội Việt
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="layout-nav__links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`layout-nav__link ${isActive(link.path) ? 'layout-nav__link--active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="layout-nav__actions">
                        <button className="layout-nav__action-btn" aria-label="Tìm kiếm">
                            <Search size={20} />
                        </button>
                        <button className="layout-nav__action-btn" aria-label="Tài khoản">
                            <User size={20} />
                        </button>
                        <button
                            className="layout-nav__action-btn layout-nav__action-btn--mobile"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="layout-nav__mobile">
                        <div className="layout-nav__mobile-links">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`layout-nav__mobile-link ${isActive(link.path) ? 'layout-nav__mobile-link--active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
