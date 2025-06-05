import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='bg-primary h-screen flex flex-col justify-center items-center space-y-6'>
      <h1 className='text-5xl font-extrabold text-center text-white'>404</h1>
      <p className='font-semibold text-white'>Sorry, the page you are looking for is not found</p>
      <Link
        to='/'
        className='bg-secondary text-white px-6 py-2 rounded-[15px] cursor-pointer focus:outline-none focus:ring-3 focus:ring-blue-200'
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
