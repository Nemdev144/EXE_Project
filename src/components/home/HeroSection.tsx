import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className="relative h-[600px] md:h-[700px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80"
                    alt="Vietnamese Central Highlands culture"
                    className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>

            {/* Decorative Pattern - Vietnamese Motif */}
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 opacity-20">
                <div className="h-full bg-repeat-y" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z' fill='%23B22222' fill-opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Content */}
            <div className="container relative h-full flex items-center">
                <div className="max-w-2xl animate-fade-in">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                        BẢO TỒN VÀ{' '}
                        <span className="text-[#D69E2E]">TRẢI NGHIỆM</span>{' '}
                        VĂN HÓA
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                        Khám phá và lưu giữ di sản văn hóa Tây Nguyên thông qua công nghệ số kết nối
                        cộng đồng với truyền thống trong thế giới hiện đại.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link
                            to="/tours"
                            className="btn bg-[var(--color-primary)] text-white px-12 py-6 text-lg font-bold hover:bg-[var(--color-primary-dark)] transition-colors"
                        >
                            Khám phá ngay
                            <ArrowRight className="w-6 h-6 ml-2" />
                        </Link>
                        <Link
                            to="/about"
                            className="btn bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-12 py-6 text-lg font-bold hover:bg-white/20 transition-colors"
                        >
                            Tìm hiểu thêm
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                >
                    <path
                        d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        fill="var(--color-bg)"
                    />
                </svg>
            </div>
        </section>
    );
}
