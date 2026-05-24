import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article';
  hover?: boolean;
}

export function Card({
  as: Tag = 'div',
  hover = false,
  className,
  children,
  ...rest
}: CardProps): React.ReactElement {
  return (
    <Tag
      className={cn(
        'overflow-hidden rounded-2xl bg-white shadow-soft',
        hover && 'transition-shadow duration-300 hover:shadow-medium',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
