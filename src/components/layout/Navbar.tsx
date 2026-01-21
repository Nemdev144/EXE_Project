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
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="text-xl font-bold text-[var(--color-primary)] hidden sm:block">
                            Cội Việt
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-[var(--color-primary)] ${isActive(link.path)
                                        ? 'text-[var(--color-primary)]'
                                        : 'text-[var(--color-text)]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search Button */}
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Tìm kiếm"
                        >
                            <Search className="w-5 h-5 text-[var(--color-text-light)]" />
                        </button>

                        {/* User Button */}
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Tài khoản"
                        >
                            <User className="w-5 h-5 text-[var(--color-text-light)]" />
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
                        >
                            {isOpen ? (
                                <X className="w-6 h-6 text-[var(--color-text)]" />
                            ) : (
                                <Menu className="w-6 h-6 text-[var(--color-text)]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                                            ? 'bg-[var(--color-primary)] text-white'
                                            : 'hover:bg-gray-100 text-[var(--color-text)]'
                                        }`}
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
