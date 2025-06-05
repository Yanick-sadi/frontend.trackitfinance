import {
  Gauge,
  PiggyBank,
  Landmark,
  CreditCard,
  Users,
  Settings,
  User,
} from 'lucide-react';

const specialRoutes = [
  '/admin/dashboard',
  '/employee/dashboard',
  '/admin/dashboard/savings',
  '/admin/dashboard/loans',
  '/admin/dashboard/repayments',
  '/admin/dashboard/employees',
  '/admin/dashboard/organization-settings',
  '/employee/dashboard/savings',
  '/employee/dashboard/loans',
  '/employee/dashboard/repayments',
  '/employee/dashboard/profile',
];

const adminNavLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/admin/dashboard/savings', label: 'Savings', icon: PiggyBank },
  { href: '/admin/dashboard/loans', label: 'Loans', icon: Landmark },
  {
    href: '/admin/dashboard/repayments',
    label: 'Loan Repayments',
    icon: CreditCard,
  },
  { href: '/admin/dashboard/employees', label: 'Employees', icon: Users },
  {
    href: '/admin/dashboard/organization-settings',
    label: 'Organization Settings',
    icon: Settings,
  },
];

const employeeNavLinks = [
  { href: '/employee/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/employee/dashboard/savings', label: 'My Savings', icon: PiggyBank },
  { href: '/employee/dashboard/loans', label: 'My Loans', icon: Landmark },
  {
    href: '/employee/dashboard/repayments',
    label: 'My Loan Repayments',
    icon: CreditCard,
  },
  { href: '/employee/dashboard/profile', label: 'My Profile', icon: User },
];

export { specialRoutes, adminNavLinks, employeeNavLinks };
