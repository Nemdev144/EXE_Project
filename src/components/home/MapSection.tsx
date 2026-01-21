import { useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import type { Province, CultureItem } from '../../types';

interface MapSectionProps {
    provinces: Province[];
    cultureItems: CultureItem[];
}

const categories = [
    { key: 'all', label: 'Tất cả', icon: '🌟' },
    { key: 'FESTIVAL', label: 'Lễ hội', icon: '🎉' },
    { key: 'FOOD', label: 'Ẩm thực', icon: '🍜' },
    { key: 'COSTUME', label: 'Trang phục', icon: '👘' },
    { key: 'INSTRUMENT', label: 'Nghệ nhân', icon: '🎭' },
    { key: 'CRAFT', label: 'Nghề thủ công', icon: '🏺' },
];

// Accurate geographic coordinates and positions for Tây Nguyên provinces
// Map bounds: Lat 11.5°N to 15°N, Lon 107°E to 109°E (approximately)
const provincePositions: Record<string, { top: string; left: string }> = {
    'Kon Tum': { top: '12%', left: '45%' },      // Northernmost
    'Gia Lai': { top: '30%', left: '55%' },      // North-central
    'Đắk Lắk': { top: '52%', left: '60%' },      // Central
    'Đắk Nông': { top: '68%', left: '35%' },     // South-west
    'Lâm Đồng': { top: '78%', left: '70%' },     // Southernmost, east
};

// Fallback positions by index if province name not found
const fallbackPositions = [
    { top: '12%', left: '45%' },
    { top: '30%', left: '55%' },
    { top: '52%', left: '60%' },
    { top: '68%', left: '35%' },
    { top: '78%', left: '70%' },
];

export default function MapSection({ provinces, cultureItems }: MapSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);

    const filteredItems = cultureItems.filter(
        (item) => selectedCategory === 'all' || item.category === selectedCategory
    );

    const displayedItems = filteredItems.slice(0, 5);

    // Get position for a province
    const getProvincePosition = (province: Province, index: number) => {
        return provincePositions[province.name] || fallbackPositions[index] || { top: '50%', left: '50%' };
    };

    return (
        <section className="py-20 pb-28 md:py-32 md:pb-40">
            <div className="container">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="section-title">BẢN ĐỒ TÂY NGUYÊN</h2>
                    <p className="section-subtitle">
                        Cùng khám phá 5 vùng đất của Tây Nguyên - Mảnh hình đậm bản sắc những con
                        người đậm nét văn hóa
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Map Area */}
                    <div className="lg:col-span-2 relative">
                        <div className="bg-[#2d4a3e] rounded-2xl overflow-hidden aspect-[4/3] relative shadow-2xl">
                            {/* Satellite Map Background - OpenStreetMap/Esri satellite imagery of Tây Nguyên */}
                            <img
                                src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=107,11.5,109.5,15&bboxSR=4326&size=800,600&format=jpg&f=image"
                                alt="Bản đồ vệ tinh Tây Nguyên"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback to a static satellite-style map if ESRI fails
                                    (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Vietnam_relief_location_map.jpg/800px-Vietnam_relief_location_map.jpg';
                                }}
                            />

                            {/* Dark overlay for better marker visibility */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

                            {/* Province Markers */}
                            <div className="absolute inset-0">
                                {provinces.slice(0, 5).map((province, index) => {
                                    const position = getProvincePosition(province, index);
                                    return (
                                        <button
                                            key={province.id}
                                            onClick={() => setSelectedProvince(province)}
                                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-300 ${selectedProvince?.id === province.id
                                                ? 'scale-125 z-20'
                                                : 'hover:scale-110'
                                                }`}
                                            style={{
                                                top: position.top,
                                                left: position.left,
                                            }}
                                        >
                                            {/* Pulse animation for markers */}
                                            <div className={`absolute inset-0 rounded-full bg-[var(--color-primary)] animate-ping opacity-30 ${selectedProvince?.id === province.id ? '' : 'hidden group-hover:block'
                                                }`} style={{ width: '70px', height: '70px', margin: '-3px' }} />

                                            {/* Province thumbnail */}
                                            <div className={`w-16 h-16 rounded-full overflow-hidden border-4 shadow-xl transition-all ${selectedProvince?.id === province.id
                                                ? 'border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/30'
                                                : 'border-white group-hover:border-[var(--color-primary)]'
                                                }`}>
                                                <img
                                                    src={province.thumbnailUrl || `https://picsum.photos/100?random=${province.id}`}
                                                    alt={province.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Province name label */}
                                            <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg whitespace-nowrap transition-all ${selectedProvince?.id === province.id
                                                ? 'bg-[var(--color-primary)] text-white'
                                                : 'bg-white text-gray-800'
                                                }`}>
                                                {province.name}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Map Legend */}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                                    <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                                    <span>5 tỉnh Tây Nguyên</span>
                                </div>
                            </div>

                            {/* Selected Province Info */}
                            {selectedProvince && (
                                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-5 shadow-xl animate-fade-in">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={selectedProvince.thumbnailUrl || `https://picsum.photos/100?random=${selectedProvince.id}`}
                                                alt={selectedProvince.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg">{selectedProvince.name}</h4>
                                            <p className="text-sm text-[var(--color-text-light)]">
                                                {selectedProvince.description || selectedProvince.region || 'Vùng Tây Nguyên'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedProvince(null)}
                                            className="text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Categories & Items Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setSelectedCategory(cat.key)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat.key
                                        ? 'bg-[var(--color-primary)] text-white shadow-md'
                                        : 'bg-white text-[var(--color-text)] hover:bg-gray-100 shadow-sm'
                                        }`}
                                >
                                    <span className="mr-1.5">{cat.icon}</span>
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Culture Items List */}
                        <div className="space-y-4">
                            {displayedItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-gray-100"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.thumbnailUrl || `https://picsum.photos/100?random=${item.id}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                                            <p className="text-xs text-[var(--color-text-light)] mt-1">
                                                {item.provinceName}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View All Link */}
                        <button className="w-full mt-8 py-4 px-6 text-center bg-[var(--color-primary)] text-white rounded-xl text-base font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md">
                            Xem tất cả →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
