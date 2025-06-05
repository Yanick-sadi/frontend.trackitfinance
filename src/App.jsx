import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GetStarted from './pages/GetStarted';
import AuthGuard from './authGuard';
import UnAuthorized from './pages/UnAuthorized';

// Import admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminSavings from './pages/admin/AdminSavings';
import AdminLoans from './pages/admin/AdminLoans';
import AdminRepayments from './pages/admin/AdminRepayments';
import AdminEmployees from './pages/admin/AdminEmployees';
import OrganizationSettings from './pages/admin/OrganizationSettings';

// Import employee pages
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeSavings from './pages/employee/EmployeeSavings';
import EmployeeLoans from './pages/employee/EmployeeLoans';
import EmployeeRepayments from './pages/employee/EmployeeRepayments';
import EmployeeProfile from './pages/employee/EmployeeProfile';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/get-started' element={<GetStarted />} />
        <Route path='/unauthorized' element={<UnAuthorized />} />

        <Route element={<AuthGuard />}>
          {/* Admin Routes */}
          <Route path='/admin/dashboard' element={<AuthGuard allowedRoles={['admin']} />}>
            <Route index element={<AdminDashboard />} />
            <Route path='savings' element={<AdminSavings />} />
            <Route path='loans' element={<AdminLoans />} />
            <Route path='repayments' element={<AdminRepayments />} />
            <Route path='employees' element={<AdminEmployees />} />
            <Route path='organization-settings' element={<OrganizationSettings />} />
          </Route>

          {/* Employee Routes */}
          <Route path='/employee/dashboard' element={<AuthGuard allowedRoles={['employee']} />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path='savings' element={<EmployeeSavings />} />
            <Route path='loans' element={<EmployeeLoans />} />
            <Route path='repayments' element={<EmployeeRepayments />} />
            <Route path='profile' element={<EmployeeProfile />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
