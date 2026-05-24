import { cn } from '@/lib/utils/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
};

export function Container({
  as: Tag = 'div',
  size = 'xl',
  className,
  children,
  ...rest
}: ContainerProps): React.ReactElement {
  return (
    <Tag
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', SIZE_MAP[size], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
