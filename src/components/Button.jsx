import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/utils';

const variantClasses = {
  default: 'bg-primary text-white hover:bg-primary/90',
  outline: 'border-[1px] border-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-gray-700',
  ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive: 'bg-red-200 text-red-800 hover:bg-red-300',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

function Button({ className, variant = 'default', size = 'md', asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

export { Button };
