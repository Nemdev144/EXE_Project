import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <h3 className="card__title">{title}</h3>
      )}
      {children}
    </div>
  );
}
