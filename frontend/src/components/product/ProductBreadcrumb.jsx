import { Link } from 'react-router-dom';

export default function ProductBreadcrumb({ crumbs = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-gray-300">/</span>}
          {crumb.href ? (
            <Link to={crumb.href} className="hover:text-indigo-600 transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
