import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
    explore: [
        { label: 'Bản đồ văn hóa', path: '/map' },
        { label: 'Tour trải nghiệm', path: '/tours' },
        { label: 'Lễ hội truyền thống', path: '/culture/festivals' },
        { label: 'Chính sách', path: '/policies' },
    ],
    support: [
        { label: 'Liên hệ', path: '/contact' },
        { label: 'Câu hỏi thường gặp', path: '/faq' },
        { label: 'Hướng dẫn đặt tour', path: '/guide' },
        { label: 'Chính sách', path: '/policies' },
    ],
};

const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

export default function Footer() {
    return (
        <footer className="bg-[#1a1a1a] text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <span className="text-xl font-bold brand-name">Cội Việt</span>
                        </Link>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                            Khám phá văn hóa Việt Nam qua những trải nghiệm vùng miền
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                            Khám phá
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 text-sm hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                            Hỗ trợ
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 text-sm hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                            Liên hệ
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span>0123 456 789</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                <span>info@coiviet.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Đại học FPT, Thủ Đức, TP.HCM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2025 Cội Việt. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex gap-6">
                            <Link to="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors">
                                Chính sách bảo mật
                            </Link>
                            <Link to="/terms" className="text-gray-500 text-sm hover:text-white transition-colors">
                                Điều khoản sử dụng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
