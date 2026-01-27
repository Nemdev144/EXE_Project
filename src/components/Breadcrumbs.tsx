import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import '../styles/components/_breadcrumbs.scss';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumbs__item">
            {index < items.length - 1 && item.path ? (
              <Link to={item.path} className="breadcrumbs__link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumbs__current">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <ChevronRight size={16} className="breadcrumbs__separator" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
