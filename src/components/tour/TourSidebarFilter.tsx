import type { Province } from '../../types';
import '../../styles/components/tourSidebarFilter.scss';

type ArtisanOption = {
  id: number;
  name: string;
};

type TourSidebarFilterProps = {
  search: string;
  onSearchChange: (value: string) => void;
  provinces: Province[];
  selectedProvinceId: string;
  onProvinceChange: (value: string) => void;
  artisans: ArtisanOption[];
  selectedArtisanId: string;
  onArtisanChange: (value: string) => void;
  minPrice: string;
  maxPrice: string;
  minPriceHint: number;
  maxPriceHint: number;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
};

export default function TourSidebarFilter({
  search,
  onSearchChange,
  provinces,
  selectedProvinceId,
  onProvinceChange,
  artisans,
  selectedArtisanId,
  onArtisanChange,
  minPrice,
  maxPrice,
  minPriceHint,
  maxPriceHint,
  onMinPriceChange,
  onMaxPriceChange,
  sortBy,
  onSortChange,
  onReset,
}: TourSidebarFilterProps) {
  const formatPrice = (value: number) =>
    value ? new Intl.NumberFormat('vi-VN').format(value) : '0';

  return (
    <aside className="tour-sidebar">
      <div className="tour-sidebar__header">
        <h3 className="tour-sidebar__title">Bộ lọc</h3>
        <button type="button" className="tour-sidebar__reset" onClick={onReset}>
          Xoá lọc
        </button>
      </div>

      <div className="tour-sidebar__section">
        <label className="tour-sidebar__label" htmlFor="tour-search">
          Tìm tour
        </label>
        <input
          id="tour-search"
          className="tour-sidebar__input"
          placeholder="Nhập tên tour hoặc tỉnh"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="tour-sidebar__section">
        <label className="tour-sidebar__label" htmlFor="tour-province">
          Địa điểm
        </label>
        <select
          id="tour-province"
          className="tour-sidebar__select"
          value={selectedProvinceId}
          onChange={(event) => onProvinceChange(event.target.value)}
        >
          <option value="all">Tất cả</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      <div className="tour-sidebar__section">
        <label className="tour-sidebar__label" htmlFor="tour-artisan">
          Nghệ nhân
        </label>
        <select
          id="tour-artisan"
          className="tour-sidebar__select"
          value={selectedArtisanId}
          onChange={(event) => onArtisanChange(event.target.value)}
        >
          <option value="all">Tất cả</option>
          {artisans.map((artisan) => (
            <option key={artisan.id} value={artisan.id}>
              {artisan.name}
            </option>
          ))}
        </select>
      </div>

      <div className="tour-sidebar__section">
        <span className="tour-sidebar__label">Giá (VND)</span>
        <span className="tour-sidebar__range">
          Từ {formatPrice(minPriceHint)} - {formatPrice(maxPriceHint)}
        </span>
        <div className="tour-sidebar__price">
          <input
            type="text"
            inputMode="numeric"
            min="0"
            className="tour-sidebar__input"
            placeholder={`Từ ${formatPrice(minPriceHint)}`}
            value={minPrice}
            onChange={(event) =>
              onMinPriceChange(event.target.value.replace(/[^\d]/g, ''))
            }
          />
          <input
            type="text"
            inputMode="numeric"
            min="0"
            className="tour-sidebar__input"
            placeholder={`Đến ${formatPrice(maxPriceHint)}`}
            value={maxPrice}
            onChange={(event) =>
              onMaxPriceChange(event.target.value.replace(/[^\d]/g, ''))
            }
          />
        </div>
      </div>

      <div className="tour-sidebar__section">
        <label className="tour-sidebar__label" htmlFor="tour-sort">
          Sắp xếp
        </label>
        <select
          id="tour-sort"
          className="tour-sidebar__select"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="latest">Mới nhất</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
          <option value="rating-desc">Đánh giá cao</option>
        </select>
      </div>
    </aside>
  );
}
