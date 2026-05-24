import { cn } from '@/lib/utils/cn';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'small' | 'large' | 'lead';
  as?: 'p' | 'span' | 'div';
  muted?: boolean;
}

const VARIANT_MAP: Record<NonNullable<TextProps['variant']>, string> = {
  body: 'text-base leading-7',
  small: 'text-sm leading-6',
  large: 'text-lg leading-8',
  lead: 'text-xl leading-8 font-light',
};

export function Text({
  variant = 'body',
  as: Tag = 'p',
  muted = false,
  className,
  children,
  ...rest
}: TextProps): React.ReactElement {
  return (
    <Tag
      className={cn(
        VARIANT_MAP[variant],
        muted ? 'text-neutral-600' : 'text-neutral-800',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
