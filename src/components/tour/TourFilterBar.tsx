import type { Province } from '../../types';
import '../../styles/components/tourFilterBar.scss';

type TourFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  provinces: Province[];
  selectedProvinceId: string;
  onProvinceChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
  total: number;
};

export default function TourFilterBar({
  search,
  onSearchChange,
  provinces,
  selectedProvinceId,
  onProvinceChange,
  sortBy,
  onSortChange,
  onReset,
  total,
}: TourFilterBarProps) {
  return (
    <div className="tour-filter">
      <div className="tour-filter__row">
        <div className="tour-filter__field">
          <label className="tour-filter__label" htmlFor="tour-search">
            Tìm tour
          </label>
          <input
            id="tour-search"
            className="tour-filter__input"
            placeholder="Nhập tên tour hoặc tỉnh thành"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className="tour-filter__field">
          <label className="tour-filter__label" htmlFor="tour-province">
            Tỉnh thành
          </label>
          <select
            id="tour-province"
            className="tour-filter__select"
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

        <div className="tour-filter__field">
          <label className="tour-filter__label" htmlFor="tour-sort">
            Sắp xếp
          </label>
          <select
            id="tour-sort"
            className="tour-filter__select"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="latest">Mới nhất</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="rating-desc">Đánh giá cao</option>
          </select>
        </div>

        <button type="button" className="tour-filter__reset" onClick={onReset}>
          Xoá lọc
        </button>
      </div>

      <div className="tour-filter__summary">
        <span>
          Đang hiển thị <strong>{total}</strong> tour
        </span>
      </div>
    </div>
  );
}
