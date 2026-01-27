import '../../styles/components/_category-filter.scss';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`category-filter__btn ${
            activeCategory === category ? 'category-filter__btn--active' : ''
          }`}
        >
          {category === 'all' ? 'Tất cả' : category}
        </button>
      ))}
    </div>
  );
}
