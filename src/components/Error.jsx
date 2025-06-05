import { CircleX } from 'lucide-react';

const Error = ({ description = 'There is no data at the moment!' }) => {
  return (
    <div className='flex flex-col items-center justify-center py-16'>
      <CircleX size={40} className='text-red-800' />
      <p className='mt-4 text-sm text-red-800'>{description}</p>
    </div>
  );
};

export default Error;
