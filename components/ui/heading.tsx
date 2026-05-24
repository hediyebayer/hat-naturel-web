import { cn } from '@/lib/utils/cn';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  visualLevel?: HeadingLevel;
}

const VISUAL_MAP: Record<HeadingLevel, string> = {
  1: 'font-serif text-4xl sm:text-5xl lg:text-hero text-neutral-900',
  2: 'font-serif text-3xl sm:text-4xl lg:text-heading-1 text-neutral-900',
  3: 'font-serif text-2xl sm:text-3xl lg:text-heading-2 text-neutral-900',
  4: 'font-serif text-xl sm:text-2xl lg:text-heading-3 text-neutral-900',
  5: 'font-sans text-lg font-semibold text-neutral-900',
  6: 'font-sans text-base font-semibold text-neutral-900',
};

export function Heading({
  level,
  visualLevel,
  className,
  children,
  ...rest
}: HeadingProps): React.ReactElement {
  const visual = VISUAL_MAP[visualLevel ?? level];
  const props = { className: cn(visual, className), ...rest } as React.HTMLAttributes<HTMLHeadingElement>;
  switch (level) {
    case 1:
      return <h1 {...props}>{children}</h1>;
    case 2:
      return <h2 {...props}>{children}</h2>;
    case 3:
      return <h3 {...props}>{children}</h3>;
    case 4:
      return <h4 {...props}>{children}</h4>;
    case 5:
      return <h5 {...props}>{children}</h5>;
    case 6:
      return <h6 {...props}>{children}</h6>;
  }
}
