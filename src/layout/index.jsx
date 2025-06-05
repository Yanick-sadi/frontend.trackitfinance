import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Menu, Search } from 'lucide-react';
import { Button } from '../components/Button';
import { Avatar, AvatarFallback } from '../components/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/DropdownMenu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/Sheet';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../redux/reducers/authSlice';

const Layout = ({ children, navLinks = [] }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePath = href => {
    const currentPath = location.pathname;
    let normalizedHref = href.startsWith('/') ? href : `/${href}`;

    // Handle nested routes - if we're in admin or employee section,
    // adjust the href to match the actual route structure
    if (currentPath.startsWith('/admin/dashboard') && !normalizedHref.startsWith('/admin/dashboard')) {
      if (normalizedHref === '/dashboard') {
        normalizedHref = '/admin/dashboard';
      } else if (!normalizedHref.startsWith('/admin/')) {
        normalizedHref = `/admin/dashboard${normalizedHref}`;
      }
    } else if (currentPath.startsWith('/employee/dashboard') && !normalizedHref.startsWith('/employee/dashboard')) {
      if (normalizedHref === '/dashboard') {
        normalizedHref = '/employee/dashboard';
      } else if (!normalizedHref.startsWith('/employee/')) {
        normalizedHref = `/employee/dashboard${normalizedHref}`;
      }
    }

    // For root dashboard paths, require exact match
    if (normalizedHref === '/admin/dashboard' || normalizedHref === '/employee/dashboard') {
      return currentPath === normalizedHref;
    }

    // For other paths, check exact match
    return currentPath === normalizedHref;
  };

  // Get the current page title based on the active route
  const getCurrentPageTitle = () => {
    const activeLink = navLinks.find(link => isActivePath(link.href));
    return activeLink ? activeLink.label : 'Dashboard';
  };

  const handleNavigation = link => {
    navigate(link);
  };

  const handleLogout = () => {
    dispatch(logout(user?.token));
    navigate('/');
  };

  const SidebarContent = () => (
    <nav className='flex-1 space-y-1'>
      {navLinks.map(link => (
        <Link
          key={link.label}
          to={link.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5  transition-all ${
            isActivePath(link.href) ? 'text-yellow-600' : 'text-primary hover:text-primary/70'
          }`}
        >
          <link.icon className='h-4 w-4' />
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className='flex h-screen w-full overflow-hidden bg-gray-100'>
      {/* Desktop Sidebar */}
      <aside className='hidden md:flex flex-col w-[240px] lg:w-[280px] border-r border-primary/20 bg-primary/5 fixed h-full'>
        <div className="flex items-center py-3 px-4 lg:px-6 mb-8'">
          <h1 className='font-extrabold text-2xl'>
            Track<span className='text-secondary'>It</span>
            <span className='text-secondary'>Finance</span>
          </h1>
        </div>
        <div className='flex-1 overflow-y-auto px-4 pt-8'>
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className='flex flex-1 flex-col md:ml-[240px] lg:ml-[280px]'>
        {/* Top Navigation Bar */}
        <header className='flex h-[60px] items-center gap-4 border-b border-primary/20 bg-primary/5 px-4 lg:px-6 sticky top-0 z-40'>
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[280px] p-0 bg-gray-100'>
              <SheetHeader className='p-6 border-b border-primary/20'>
                <SheetTitle className='flex items-center'>
                  <h1 className='font-extrabold text-2xl'>
                    Track<span className='text-secondary'>It</span>
                    <span className='text-secondary'>Finance</span>
                  </h1>
                </SheetTitle>
              </SheetHeader>
              <div className='p-4'>
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Dynamic Page Title */}
          <div className='flex-1'>
            <h1 className='text-xl font-bold'>{getCurrentPageTitle()}</h1>
          </div>

          {/* User Menu */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 rounded-full'>
                <Avatar className='h-8 w-8 bg-primary text-primary-foreground'>
                  <AvatarFallback className='font-extrabold'>{user?.fullName?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[200px]'>
              <DropdownMenuLabel className='flex items-center gap-2'>
                <Avatar className='h-8 w-8'>
                  <AvatarFallback className='font-extrabold'>{user?.fullName?.[0]}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-sm font-bold'>{user?.fullName}</span>
                  <span className='font-medium'>{user?.role}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigation('/account-settings')}>
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto pt-3'>
          <div className='container mx-auto p-4 lg:p-6 max-w-7xl'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
