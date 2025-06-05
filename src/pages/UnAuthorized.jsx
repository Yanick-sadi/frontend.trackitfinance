import { Link } from 'react-router-dom';

const UnAuthorized = () => {
  return (
    <div className='bg-primary h-screen flex flex-col justify-center items-center space-y-6'>
      <h1 className='text-5xl font-extrabold text-center text-white'>403</h1>
      <p className='font-semibold text-white'>Sorry, you are not authorized to view this page</p>
      <Link
        to='/'
        className='bg-secondary text-white px-6 py-2 rounded-[15px] cursor-pointer focus:outline-none focus:ring-3 focus:ring-blue-200'
      >
        Login
      </Link>
    </div>
  );
};

export default UnAuthorized;
