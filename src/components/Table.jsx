import * as React from 'react';

import { cn } from '../lib/utils';

const Table = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div className='relative w-full overflow-auto'>
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...rest} />
    </div>
  );
});
Table.displayName = 'Table';

const TableHeader = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return <thead ref={ref} className={cn('[&_tr]:border-b border-primary/20', className)} {...rest} />;
});
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...rest} />;
});
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <tfoot
      ref={ref}
      className={cn('border-t border-primary/20 bg-gray-100 font-medium [&>tr]:last:border-b-0', className)}
      {...rest}
    />
  );
});
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <tr
      ref={ref}
      className={cn(
        'border-b border-primary/20 transition-colors hover:bg-gray-100 data-[state=selected]:bg-gray-100',
        className
      )}
      {...rest}
    />
  );
});
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-gray-800 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...rest}
    />
  );
});
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return <td ref={ref} className={cn('py-2 px-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...rest} />;
});
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return <caption ref={ref} className={cn('mt-4 text-sm text-gray-800', className)} {...rest} />;
});
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
