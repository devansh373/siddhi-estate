
import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export const Card = ({ className = "", ...props }: CardProps) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl shadow-sm ${className}`}
      {...props}
    />
  );
};

type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export const CardContent = ({ className = "", ...props }: CardContentProps) => {
  return <div className={`p-4 ${className}`} {...props} />;
};