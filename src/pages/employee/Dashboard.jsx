import React from 'react';
import {
  User,
  PiggyBank,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  BarChart3,
  Badge,
} from 'lucide-react';
import {
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
  ResponsiveContainer,
} from 'recharts';
import { useGetUserStatisticsQuery } from '../../redux/api/apiSlice';
import { Skeleton } from '../../components/Skeleton';
import { Button } from '../../components/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/Card';
import Layout from '../../layout';
import { employeeNavLinks } from '../../constants';

const UserDashboard = () => {
  const { data: userStatistics, isLoading, error, refetch } = useGetUserStatisticsQuery();

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
    error: '#dc2626',
    info: '#0284c7',
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace(/RF|FRw|RWF/, 'Rwf');
  };

  const getHealthScoreColor = score => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  const getHealthScoreLabel = score => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (isLoading) {
    return (
      <Layout navLinks={employeeNavLinks}>
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

          {/* User Banner Skeleton */}
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
      <Layout navLinks={employeeNavLinks}>
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

  if (!userStatistics?.data) {
    return (
      <Layout navLinks={employeeNavLinks}>
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
          <Card className='w-full max-w-md border-0 shadow-lg'>
            <CardHeader>
              <CardTitle className='text-lg'>No Data Available</CardTitle>
              <CardDescription className='text-sm'>No user statistics found</CardDescription>
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

  const { userInfo, savingsStatistics, loanStatistics, repaymentStatistics, financialSummary } = userStatistics.data;

  // Chart data
  const savingsTrendData =
    savingsStatistics?.monthlySavingsTrend?.map(item => ({
      month: item.month.split('-')[1],
      amount: item.amount,
      count: item.count,
    })) || [];

  const loanBreakdownData = [
    {
      name: 'Approved',
      value: loanStatistics?.approved?.amount || 0,
      color: colors.success,
      count: loanStatistics?.approved?.count || 0,
    },
    {
      name: 'Pending',
      value: loanStatistics?.pending?.amount || 0,
      color: colors.warning,
      count: loanStatistics?.pending?.count || 0,
    },
    {
      name: 'Repaid',
      value: loanStatistics?.repaid?.amount || 0,
      color: colors.info,
      count: loanStatistics?.repaid?.count || 0,
    },
  ].filter(item => item.value > 0);

  const financialOverviewData = [
    { name: 'Savings', amount: financialSummary?.currentSavingsBalance || 0 },
    { name: 'Outstanding', amount: financialSummary?.outstandingLoanBalance || 0 },
    { name: 'Net Worth', amount: financialSummary?.netWorth || 0 },
  ];

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    color = colors.primary,
    bgColor = colors.lightGray,
  }) => (
    <Card className='border-0 shadow-sm hover:shadow-md transition-shadow duration-200'>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <CardTitle className='text-sm font-medium' style={{ color: colors.muted }}>
          {title}
        </CardTitle>
        {Icon && (
          <div className='h-8 w-8 rounded-lg flex items-center justify-center' style={{ backgroundColor: bgColor }}>
            <Icon className='h-4 w-4' style={{ color }} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-semibold' style={{ color }}>
          {value}
        </div>
        {subtitle && (
          <p className='text-xs mt-1' style={{ color: colors.darkGray }}>
            {subtitle}
          </p>
        )}
      </CardContent>
      {trend && (
        <CardFooter className='pt-0'>
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUpRight className='h-3 w-3' /> : <ArrowDownRight className='h-3 w-3' />}
            <span className='ml-1 text-xs'>{trendValue}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <Layout navLinks={employeeNavLinks}>
      <div className='min-h-screen px-6'>
        <div className='max-w-7xl mx-auto space-y-6'>
          {/* Header */}
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold' style={{ color: colors.primary }}>
                My Financial Dashboard
              </h1>
              <p className='text-gray-600 mt-1'>Welcome back, {userInfo?.firstName}! Here's your financial overview</p>
            </div>
            <div className='flex items-center gap-4'>
              <div className='text-right'>
                <p className='text-sm text-gray-500'>Financial Health Score</p>
                <div className='flex items-center gap-2'>
                  <div
                    className='text-2xl font-bold'
                    style={{ color: getHealthScoreColor(financialSummary?.financialHealthScore || 0) }}
                  >
                    {financialSummary?.financialHealthScore || 0}/100
                  </div>
                  <span
                    className='px-2 py-1 rounded-full text-xs font-medium text-white'
                    style={{ backgroundColor: getHealthScoreColor(financialSummary?.financialHealthScore || 0) }}
                  >
                    {getHealthScoreLabel(financialSummary?.financialHealthScore || 0)}
                  </span>
                </div>
              </div>
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

          {/* User Info Banner */}
          <Card
            className='border-0 shadow-sm text-white'
            style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.muted} 100%)` }}
          >
            <CardHeader className='flex flex-row items-center gap-4'>
              <div className='p-3 rounded-lg' style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                <User className='h-7 w-7' />
              </div>
              <div>
                <CardTitle className='text-xl font-semibold'>
                  {userInfo?.firstName} {userInfo?.lastName}
                </CardTitle>
                <CardDescription className='text-gray-200 text-sm'>{userInfo?.email}</CardDescription>
                <div className='flex items-center gap-4 mt-2 text-xs text-gray-200'>
                  <span>{userInfo?.organization?.name}</span>
                  <span>•</span>
                  <span>Member for {Math.floor(userInfo?.ageInDays / 30)} months</span>
                  <span>•</span>
                  <span>Rank: {userInfo?.rankInOrganization}</span>
                  {userInfo?.topPerformer && (
                    <>
                      <span>•</span>
                      <div className='flex items-center gap-1'>
                        <Award className='h-4 w-4' />
                        <span>Top Performer</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Key Metrics Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <StatCard
              title='Total Savings'
              value={formatCurrency(savingsStatistics?.totalAmount || 0)}
              subtitle={`${savingsStatistics?.totalCount || 0} transactions`}
              icon={PiggyBank}
              color={colors.success}
              bgColor='#f0fdf4'
              trend='up'
              trendValue={formatCurrency(savingsStatistics?.recent30Days?.amount || 0)}
            />
            <StatCard
              title='Active Loans'
              value={formatCurrency(loanStatistics?.approved?.amount || 0)}
              subtitle={`${loanStatistics?.approved?.count || 0} approved loans`}
              icon={CreditCard}
              color={colors.warning}
              bgColor='#fefce8'
            />
            <StatCard
              title='Outstanding Balance'
              value={formatCurrency(financialSummary?.outstandingLoanBalance || 0)}
              subtitle='Amount to repay'
              icon={TrendingDown}
              color={colors.error}
              bgColor='#fef2f2'
            />
            <StatCard
              title='Net Worth'
              value={formatCurrency(financialSummary?.netWorth || 0)}
              subtitle='Savings - Outstanding'
              icon={TrendingUp}
              color={colors.info}
              bgColor='#f0f9ff'
            />
          </div>

          {/* Charts Row */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Savings Trend */}
            <Card className='lg:col-span-2 border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold' style={{ color: colors.primary }}>
                  Savings Trend (Last 6 Months)
                </CardTitle>
                <CardDescription className='text-sm'>Your monthly savings pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart data={savingsTrendData}>
                      <defs>
                        <linearGradient id='savingsGradient' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor={colors.success} stopOpacity={0.2} />
                          <stop offset='95%' stopColor={colors.success} stopOpacity={0} />
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
                        formatter={(value, name) => [formatCurrency(value), name === 'amount' ? 'Amount' : 'Count']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: `1px solid ${colors.mediumGray}`,
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type='monotone'
                        dataKey='amount'
                        stroke={colors.success}
                        strokeWidth={2}
                        fill='url(#savingsGradient)'
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Loan Breakdown */}
            <Card className='border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold' style={{ color: colors.primary }}>
                  Loan Status
                </CardTitle>
                <CardDescription className='text-sm'>Current loan distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-60'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={loanBreakdownData}
                        cx='50%'
                        cy='50%'
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey='value'
                      >
                        {loanBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => formatCurrency(value)} contentStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className='mt-4 space-y-2'>
                  {loanBreakdownData.map((item, index) => (
                    <div key={index} className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div className='h-3 w-3 rounded-full' style={{ backgroundColor: item.color }} />
                        <span className='text-sm text-gray-600'>{item.name}</span>
                      </div>
                      <span className='text-sm font-medium' style={{ color: colors.primary }}>
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Financial Overview */}
            <Card className='border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold' style={{ color: colors.primary }}>
                  Financial Overview
                </CardTitle>
                <CardDescription className='text-sm'>Your financial position at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-64'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={financialOverviewData} barCategoryGap='25%'>
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
                        formatter={value => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: `1px solid ${colors.mediumGray}`,
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey='amount' radius={[4, 4, 0, 0]} maxBarSize={60}>
                        {financialOverviewData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? colors.success : index === 1 ? colors.error : colors.info}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className='border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold' style={{ color: colors.primary }}>
                  Recent Activity (30 Days)
                </CardTitle>
                <CardDescription className='text-sm'>Your latest financial activities</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div
                  className='flex items-center justify-between p-4 rounded-lg'
                  style={{ backgroundColor: colors.lightGray }}
                >
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-green-100'>
                      <PiggyBank className='h-5 w-5 text-green-600' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-700'>New Savings</p>
                      <p className='text-xs text-gray-500'>
                        {savingsStatistics?.recent30Days?.count || 0} transactions
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-semibold' style={{ color: colors.success }}>
                      {formatCurrency(savingsStatistics?.recent30Days?.amount || 0)}
                    </p>
                  </div>
                </div>

                <div
                  className='flex items-center justify-between p-4 rounded-lg'
                  style={{ backgroundColor: colors.lightGray }}
                >
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-blue-100'>
                      <CreditCard className='h-5 w-5 text-blue-600' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-700'>New Loans</p>
                      <p className='text-xs text-gray-500'>{loanStatistics?.recent30Days?.count || 0} applications</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-semibold' style={{ color: colors.info }}>
                      {formatCurrency(loanStatistics?.recent30Days?.amount || 0)}
                    </p>
                  </div>
                </div>

                <div
                  className='flex items-center justify-between p-4 rounded-lg'
                  style={{ backgroundColor: colors.lightGray }}
                >
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-orange-100'>
                      <ArrowUpRight className='h-5 w-5 text-orange-600' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-700'>Repayments</p>
                      <p className='text-xs text-gray-500'>{repaymentStatistics?.recent30Days?.count || 0} payments</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-semibold' style={{ color: colors.warning }}>
                      {formatCurrency(repaymentStatistics?.recent30Days?.amount || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold' style={{ color: colors.primary }}>
                Performance Metrics
              </CardTitle>
              <CardDescription className='text-sm'>
                Key performance indicators for your financial journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='text-center p-4 rounded-lg' style={{ backgroundColor: colors.lightGray }}>
                  <BarChart3 className='h-10 w-10 mx-auto mb-3' style={{ color: colors.success }} />
                  <p className='text-sm font-medium text-gray-700'>Average Savings</p>
                  <p className='text-xl font-semibold mt-1' style={{ color: colors.primary }}>
                    {formatCurrency(savingsStatistics?.averagePerTransaction || 0)}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>Per transaction</p>
                </div>

                <div className='text-center p-4 rounded-lg' style={{ backgroundColor: colors.lightGray }}>
                  <Badge className='h-10 w-10 mx-auto mb-3' style={{ color: colors.warning }} />
                  <p className='text-sm font-medium text-gray-700'>Loan Approval Rate</p>
                  <p className='text-xl font-semibold mt-1' style={{ color: colors.primary }}>
                    {loanStatistics?.metrics?.approvalRate || '0%'}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>Success rate</p>
                </div>

                <div className='text-center p-4 rounded-lg' style={{ backgroundColor: colors.lightGray }}>
                  <CheckCircle className='h-10 w-10 mx-auto mb-3' style={{ color: colors.info }} />
                  <p className='text-sm font-medium text-gray-700'>Repayment Rate</p>
                  <p className='text-xl font-semibold mt-1' style={{ color: colors.primary }}>
                    {loanStatistics?.metrics?.repaymentRate || '0%'}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>On-time payments</p>
                </div>

                <div className='text-center p-4 rounded-lg' style={{ backgroundColor: colors.lightGray }}>
                  <Target className='h-10 w-10 mx-auto mb-3' style={{ color: colors.secondary }} />
                  <p className='text-sm font-medium text-gray-700'>Organization Rank</p>
                  <p className='text-xl font-semibold mt-1' style={{ color: colors.primary }}>
                    #{userInfo?.rankInOrganization?.split(' ')[0] || 'N/A'}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    Out of {userInfo?.rankInOrganization?.split(' ')[2] || 'N/A'} members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
