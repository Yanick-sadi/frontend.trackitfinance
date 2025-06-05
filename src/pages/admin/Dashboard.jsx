import React from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  PiggyBank,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building2,
  Activity,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/Card';
import { Skeleton } from '../../components/Skeleton';
import { Button } from '../../components/Button';
import { useGetOrganizationStatisticsQuery } from '../../redux/api/apiSlice';
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { adminNavLinks } from '../../constants';
import Layout from '../../layout';

const Dashboard = () => {
  const { data: organizationStatistics, isLoading, error, refetch } = useGetOrganizationStatisticsQuery();

  // Color palette based on your design system
  const colors = {
    primary: '#003f51',
    secondary: '#e3b922',
    accent: '#FFF8F0',
    muted: '#4a5565',
    lightGray: '#f8fafc',
    mediumGray: '#e2e8f0',
    darkGray: '#64748b',
    success: '#059669',
    warning: '#d97706',
    info: '#0284c7',
  };

  // Format currency
  const formatCurrency = amount => {
    const formatted = new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      currencyDisplay: 'symbol',
    }).format(amount);

    return formatted.replace(/RF|FRw|RWF/, 'Rwf');
  };

  if (isLoading) {
    return (
      <Layout navLinks={adminNavLinks}>
        <div className='flex flex-col gap-6 p-6 bg-gray-50 min-h-screen'>
          {/* Header Skeleton */}
          <div className='flex justify-between items-center'>
            <div>
              <Skeleton className='h-8 w-48 mb-2' />
              <Skeleton className='h-4 w-64' />
            </div>
            <div className='flex gap-3'>
              <Skeleton className='h-10 w-32' />
              <Skeleton className='h-10 w-24' />
            </div>
          </div>

          {/* Organization Banner Skeleton */}
          <Skeleton className='h-28 w-full rounded-lg' />

          {/* Stats Grid Skeleton */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className='border-0 shadow-sm'>
                <CardHeader>
                  <Skeleton className='h-4 w-3/4' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-7 w-1/2 mb-2' />
                  <Skeleton className='h-3 w-full' />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row Skeleton */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <Skeleton className='lg:col-span-2 h-72 rounded-lg' />
            <Skeleton className='h-72 rounded-lg' />
          </div>

          {/* Bottom Row Skeleton */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Skeleton className='h-72 rounded-lg' />
            <Skeleton className='h-72 rounded-lg' />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout navLinks={adminNavLinks}>
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
          <Card className='w-full max-w-md border-0 shadow-lg'>
            <CardHeader>
              <CardTitle className='text-red-600 text-lg'>Error Loading Dashboard</CardTitle>
              <CardDescription className='text-sm'>
                {'data' in error ? JSON.stringify(error.data) : 'An unknown error occurred'}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={refetch}
                className='w-full text-sm'
                style={{ backgroundColor: colors.primary, color: 'white' }}
              >
                <Activity className='w-4 h-4 mr-2' />
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!organizationStatistics?.data) {
    return (
      <Layout navLinks={adminNavLinks}>
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
          <Card className='w-full max-w-md border-0 shadow-lg'>
            <CardHeader>
              <CardTitle className='text-lg'>No Data Available</CardTitle>
              <CardDescription className='text-sm'>No organization statistics found</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={refetch}
                className='w-full text-sm'
                style={{ backgroundColor: colors.primary, color: 'white' }}
              >
                <Activity className='w-4 h-4 mr-2' />
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  const { organizationInfo, userStatistics, financialStatistics } = organizationStatistics.data;

  // Chart data with refined colors
  const roleData = [
    { name: 'Admins', value: userStatistics?.adminCount, color: colors.primary },
    { name: 'Employees', value: userStatistics?.employeeCount, color: colors.secondary },
  ];

  const loanStatusData = [
    { name: 'Approved', value: financialStatistics?.loans.approved.amount, color: colors.success },
    { name: 'Pending', value: financialStatistics?.loans.pending.amount, color: colors.warning },
    { name: 'Repaid', value: financialStatistics?.loans.repaid.amount, color: colors.info },
  ];

  const monthlyTrendData = [
    { month: 'Jan', savings: 180000, loans: 120000, repayments: 85000 },
    { month: 'Feb', savings: 220000, loans: 180000, repayments: 95000 },
    { month: 'Mar', savings: 280000, loans: 220000, repayments: 140000 },
    { month: 'Apr', savings: 350000, loans: 280000, repayments: 180000 },
    { month: 'May', savings: 420000, loans: 340000, repayments: 220000 },
    { month: 'Jun', savings: 485000, loans: 340000, repayments: 185000 },
  ];

  const StatCard = ({ title, value, change, icon: Icon, changeType, subtitle }) => (
    <Card className='border-0 shadow-sm hover:shadow-md transition-shadow duration-200'>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <CardTitle className='text-sm font-medium' style={{ color: colors.muted }}>
          {title}
        </CardTitle>
        {Icon && (
          <div
            className='h-8 w-8 rounded-lg flex items-center justify-center'
            style={{ backgroundColor: colors.lightGray }}
          >
            <Icon className='h-4 w-4' style={{ color: colors.primary }} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-semibold' style={{ color: colors.primary }}>
          {value}
        </div>
        {subtitle && (
          <p className='text-xs mt-1' style={{ color: colors.darkGray }}>
            {subtitle}
          </p>
        )}
      </CardContent>
      {change && (
        <CardFooter className='pt-0'>
          <div
            className={`flex items-center text-sm ${changeType === 'positive' ? 'text-emerald-600' : 'text-red-500'}`}
          >
            {changeType === 'positive' ? <ArrowUpRight className='h-3 w-3' /> : <ArrowDownRight className='h-3 w-3' />}
            <span className='ml-1 text-xs'>{change}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <Layout navLinks={adminNavLinks}>
      <div className='flex flex-col gap-6 px-6  min-h-screen'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight' style={{ color: colors.primary }}>
              Dashboard
            </h1>
            <p className='text-sm mt-1' style={{ color: colors.muted }}>
              Welcome back! Here's what's happening with {organizationInfo?.name}
            </p>
          </div>
          <div className='flex gap-3'>
            <Button
              variant='outline'
              className='gap-2 text-sm border-gray-200 hover:bg-gray-50'
              style={{ color: colors.muted }}
            >
              <Calendar className='h-4 w-4' />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Button>
            <Button
              onClick={refetch}
              className='gap-2 text-sm'
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              <Activity className='h-4 w-4' />
              Refresh
            </Button>
          </div>
        </div>

        {/* Organization Info Banner */}
        <Card
          className='border-0 shadow-sm text-white'
          style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.muted} 100%)` }}
        >
          <CardHeader className='flex flex-row items-center gap-4'>
            <div className='p-3 rounded-lg' style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Building2 className='h-7 w-7' />
            </div>
            <div>
              <CardTitle className='text-xl font-semibold'>{organizationInfo?.name}</CardTitle>
              <CardDescription className='text-gray-200 text-sm'>{organizationInfo.address}</CardDescription>
              <div className='flex items-center gap-4 mt-2 text-xs text-gray-200'>
                <span>Active for {Math.floor(organizationInfo.ageInDays / 365)} years</span>
                <span>•</span>
                <span>{userStatistics.totalUsers} total members</span>
                <span>•</span>
                <span>{formatCurrency(financialStatistics.summary.totalFinancialActivity)} total activity</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Key Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            title='Total Users'
            value={userStatistics?.totalUsers}
            change='+12 this month'
            changeType='positive'
            icon={Users}
            subtitle={`${userStatistics?.adminCount} admins, ${userStatistics?.employeeCount} employees`}
          />
          <StatCard
            title='Total Savings'
            value={formatCurrency(financialStatistics.savings.totalAmount)}
            change={`+${formatCurrency(financialStatistics.savings.recent30Days.amount)} (30d)`}
            changeType='positive'
            icon={PiggyBank}
            subtitle={`${financialStatistics.savings.totalCount} accounts`}
          />
          <StatCard
            title='Active Loans'
            value={formatCurrency(financialStatistics.loans.approved.amount)}
            subtitle={`${financialStatistics.loans.approved.count} approved loans`}
            icon={CreditCard}
          />
          <StatCard
            title='Outstanding Balance'
            value={formatCurrency(financialStatistics.summary.outstandingLoanBalance)}
            subtitle='Amount to be repaid'
            icon={TrendingUp}
          />
        </div>

        {/* Charts Row */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Monthly Trends */}
          <Card className='lg:col-span-2 border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold' style={{ color: colors.primary }}>
                Financial Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-[280px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient id='savingsGradient' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor={colors.success} stopOpacity={0.15} />
                        <stop offset='95%' stopColor={colors.success} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id='loansGradient' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor={colors.primary} stopOpacity={0.15} />
                        <stop offset='95%' stopColor={colors.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke={colors.mediumGray} />
                    <XAxis
                      dataKey='month'
                      tick={{ fontSize: 12, fill: colors.muted }}
                      axisLine={{ stroke: colors.mediumGray }}
                    />
                    <YAxis
                      tickFormatter={value => `${value / 1000}k`}
                      tick={{ fontSize: 12, fill: colors.muted }}
                      axisLine={{ stroke: colors.mediumGray }}
                    />
                    <Tooltip
                      formatter={value => formatCurrency(Number(value))}
                      labelStyle={{ color: colors.muted, fontSize: '12px' }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: `1px solid ${colors.mediumGray}`,
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Area
                      type='monotone'
                      dataKey='savings'
                      stroke={colors.success}
                      strokeWidth={2}
                      fill='url(#savingsGradient)'
                      name='Savings'
                    />
                    <Area
                      type='monotone'
                      dataKey='loans'
                      stroke={colors.primary}
                      strokeWidth={2}
                      fill='url(#loansGradient)'
                      name='Loans'
                    />
                    <Line
                      type='monotone'
                      dataKey='repayments'
                      stroke={colors.warning}
                      strokeWidth={2}
                      name='Repayments'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Distribution */}
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold' style={{ color: colors.primary }}>
                User Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-[240px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx='50%'
                      cy='50%'
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey='value'
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='mt-4 space-y-2'>
                {roleData.map((item, index) => (
                  <div key={index} className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='h-3 w-3 rounded-full' style={{ backgroundColor: item.color }}></div>
                      <span className='text-sm' style={{ color: colors.muted }}>
                        {item?.name}
                      </span>
                    </div>
                    <span className='text-sm font-medium' style={{ color: colors.primary }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Loan Status Breakdown */}
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold' style={{ color: colors.primary }}>
                Loan Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-[240px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={loanStatusData} barCategoryGap='35%'>
                    <CartesianGrid strokeDasharray='3 3' stroke={colors.mediumGray} />
                    <XAxis
                      dataKey='name'
                      tick={{ fontSize: 12, fill: colors.muted }}
                      axisLine={{ stroke: colors.mediumGray }}
                    />
                    <YAxis
                      tickFormatter={value => `${value / 1000}k`}
                      tick={{ fontSize: 12, fill: colors.muted }}
                      axisLine={{ stroke: colors.mediumGray }}
                    />
                    <Tooltip
                      formatter={value => formatCurrency(Number(value))}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: `1px solid ${colors.mediumGray}`,
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey='value' radius={[4, 4, 0, 0]} maxBarSize={60}>
                      {loanStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold' style={{ color: colors.primary }}>
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div
                className='flex items-center justify-between p-4 rounded-lg'
                style={{ backgroundColor: colors.lightGray }}
              >
                <div>
                  <p className='text-sm font-medium' style={{ color: colors.muted }}>
                    Net Financial Position
                  </p>
                  <p className='text-xl font-semibold mt-1' style={{ color: colors.primary }}>
                    {formatCurrency(financialStatistics.summary.netFinancialPosition)}
                  </p>
                </div>
                <div className='p-3 rounded-lg' style={{ backgroundColor: colors.mediumGray }}>
                  <TrendingUp className='h-5 w-5' style={{ color: colors.primary }} />
                </div>
              </div>

              <div
                className='flex items-center justify-between p-4 rounded-lg'
                style={{ backgroundColor: colors.lightGray }}
              >
                <div>
                  <p className='text-sm font-medium' style={{ color: colors.muted }}>
                    Organization Liquidity
                  </p>
                  <p className='text-xl font-semibold mt-1' style={{ color: colors.primary }}>
                    {formatCurrency(financialStatistics.summary.organizationLiquidity)}
                  </p>
                </div>
                <div className='p-3 rounded-lg' style={{ backgroundColor: colors.mediumGray }}>
                  <DollarSign className='h-5 w-5' style={{ color: colors.primary }} />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div className='text-center p-4 rounded-lg' style={{ backgroundColor: colors.lightGray }}>
                  <p className='text-xs' style={{ color: colors.muted }}>
                    Avg Savings/User
                  </p>
                  <p className='text-lg font-semibold mt-1' style={{ color: colors.primary }}>
                    {formatCurrency(financialStatistics.savings.averagePerUser)}
                  </p>
                </div>
                <div className='text-center p-4 rounded-lg' style={{ backgroundColor: colors.lightGray }}>
                  <p className='text-xs' style={{ color: colors.muted }}>
                    Total Repayments
                  </p>
                  <p className='text-lg font-semibold mt-1' style={{ color: colors.primary }}>
                    {formatCurrency(financialStatistics.repayments.totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Summary */}
        <Card className='border-0 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold' style={{ color: colors.primary }}>
              30-Day Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='text-center p-5 rounded-lg' style={{ backgroundColor: colors.lightGray }}>
                <PiggyBank className='h-10 w-10 mx-auto mb-3' style={{ color: colors.success }} />
                <p className='text-sm font-medium' style={{ color: colors.muted }}>
                  Recent Savings
                </p>
                <p className='text-xl font-semibold mt-1' style={{ color: colors.primary }}>
                  {formatCurrency(financialStatistics.savings.recent30Days.amount)}
                </p>
                <p className='text-xs mt-1' style={{ color: colors.darkGray }}>
                  {financialStatistics.savings.recent30Days.count} transactions
                </p>
              </div>

              <div className='text-center p-5 rounded-lg' style={{ backgroundColor: colors.lightGray }}>
                <CreditCard className='h-10 w-10 mx-auto mb-3' style={{ color: colors.warning }} />
                <p className='text-sm font-medium' style={{ color: colors.muted }}>
                  Recent Loans
                </p>
                <p className='text-xl font-semibold mt-1' style={{ color: colors.primary }}>
                  {formatCurrency(financialStatistics.loans.recent30Days.amount)}
                </p>
                <p className='text-xs mt-1' style={{ color: colors.darkGray }}>
                  {financialStatistics.loans.recent30Days.count} applications
                </p>
              </div>

              <div className='text-center p-5 rounded-lg' style={{ backgroundColor: colors.lightGray }}>
                <ArrowUpRight className='h-10 w-10 mx-auto mb-3' style={{ color: colors.info }} />
                <p className='text-sm font-medium' style={{ color: colors.muted }}>
                  Recent Repayments
                </p>
                <p className='text-xl font-semibold mt-1' style={{ color: colors.primary }}>
                  {formatCurrency(financialStatistics.repayments.recent30Days.amount)}
                </p>
                <p className='text-xs mt-1' style={{ color: colors.darkGray }}>
                  {financialStatistics.repayments.recent30Days.count} payments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
