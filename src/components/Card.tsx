import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {title && (
        <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  );
}
