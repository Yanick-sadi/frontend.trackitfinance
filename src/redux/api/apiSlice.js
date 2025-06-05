import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const { VITE_APP_BASE_API_URL } = import.meta.env;

const baseQuery = fetchBaseQuery({
  baseUrl: VITE_APP_BASE_API_URL,
  prepareHeaders: headers => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Ensure error.data is treated as an object with an optional 'message' property
  const errorData = result.error?.data;

  if (errorData && errorData.code === 'EXPIREDTOKEN') {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => {
    return {
      // Auth Routes
      login: builder.mutation({
        query: data => ({
          url: 'auth/login',
          method: 'POST',
          body: data,
        }),
      }),

      forgotPassword: builder.mutation({
        query: data => ({
          url: 'auth/forgot-password',
          method: 'POST',
          body: data,
        }),
      }),

      resetPassword: builder.mutation({
        query: ({ resetToken, password }) => ({
          url: `auth/reset-password/${resetToken}`,
          method: 'POST',
          body: { password },
        }),
      }),

      createUser: builder.mutation({
        query: data => ({
          url: 'users',
          method: 'POST',
          body: data,
        }),
      }),

      // User Routes
      getCurrentUser: builder.query({
        query: () => ({
          url: 'users/me',
          method: 'GET',
        }),
      }),

      getUsers: builder.query({
        query: () => ({
          url: 'users',
          method: 'GET',
        }),
      }),

      getUserStatistics: builder.query({
        query: () => ({
          url: 'users/me/statistics',
          method: 'GET',
        }),
      }),

      getUser: builder.query({
        query: id => ({
          url: `users/${id}`,
          method: 'GET',
        }),
      }),

      updateUser: builder.mutation({
        query: ({ userId, data }) => ({
          url: `users/${userId}`,
          method: 'PUT',
          body: data,
        }),
      }),

      deleteUser: builder.mutation({
        query: id => ({
          url: `users/${id}`,
          method: 'DELETE',
        }),
      }),

      // Organization Routes
      getOrganizations: builder.query({
        query: () => ({
          url: 'organizations',
          method: 'GET',
        }),
      }),

      getOrganization: builder.query({
        query: () => ({
          url: `organizations/me`,
          method: 'GET',
        }),
      }),

      getOrganizationStatistics: builder.query({
        query: () => ({
          url: `organizations/me/statistics`,
          method: 'GET',
        }),
      }),

      registerOrganization: builder.mutation({
        query: data => ({
          url: 'organizations/with-admin-accoount',
          method: 'POST',
          body: data,
        }),
      }),

      createOrganization: builder.mutation({
        query: data => ({
          url: 'organizations',
          method: 'POST',
          body: data,
        }),
      }),

      updateOrganization: builder.mutation({
        query: ({ id, data }) => ({
          url: `organizations/${id}`,
          method: 'PUT',
          body: data,
        }),
      }),

      deleteOrganization: builder.mutation({
        query: id => ({
          url: `organizations/${id}`,
          method: 'DELETE',
        }),
      }),

      // Profile Routes
      getProfiles: builder.query({
        query: () => ({
          url: 'profiles',
          method: 'GET',
        }),
      }),

      getMyProfile: builder.query({
        query: () => ({
          url: 'profiles/me',
          method: 'GET',
        }),
      }),

      createProfile: builder.mutation({
        query: data => ({
          url: 'profiles',
          method: 'POST',
          body: data,
        }),
      }),

      updateProfile: builder.mutation({
        query: ({ id, data }) => ({
          url: `profiles/${id}`,
          method: 'PUT',
          body: data,
        }),
      }),

      deleteProfile: builder.mutation({
        query: id => ({
          url: `profiles/${id}`,
          method: 'DELETE',
        }),
      }),

      // Savings Routes
      getSavings: builder.query({
        query: () => ({
          url: 'savings',
          method: 'GET',
        }),
      }),

      getMySavings: builder.query({
        query: () => ({
          url: `savings/me`,
          method: 'GET',
        }),
      }),

      createSaving: builder.mutation({
        query: data => ({
          url: 'savings',
          method: 'POST',
          body: data,
        }),
      }),

      updateSaving: builder.mutation({
        query: ({ id, data }) => ({
          url: `savings/${id}`,
          method: 'PUT',
          body: data,
        }),
      }),

      deleteSaving: builder.mutation({
        query: id => ({
          url: `savings/${id}`,
          method: 'DELETE',
        }),
      }),

      // Loan Routes
      getLoans: builder.query({
        query: () => ({
          url: 'loans',
          method: 'GET',
        }),
      }),

      getMyLoans: builder.query({
        query: () => ({
          url: 'loans/me',
          method: 'GET',
        }),
      }),

      createLoan: builder.mutation({
        query: data => ({
          url: 'loans',
          method: 'POST',
          body: data,
        }),
      }),

      updateLoan: builder.mutation({
        query: ({ id, data }) => ({
          url: `loans/${id}/status`,
          method: 'PUT',
          body: data,
        }),
      }),

      deleteLoan: builder.mutation({
        query: id => ({
          url: `loans/${id}`,
          method: 'DELETE',
        }),
      }),

      // Loan Repayment Routes
      getRepayments: builder.query({
        query: () => ({
          url: 'repayments',
          method: 'GET',
        }),
      }),

      getMyRepayments: builder.query({
        query: () => ({
          url: 'repayments/me',
          method: 'GET',
        }),
      }),

      createRepayment: builder.mutation({
        query: data => ({
          url: 'repayments',
          method: 'POST',
          body: data,
        }),
      }),

      updateRepayment: builder.mutation({
        query: ({ id, data }) => ({
          url: `repayments/${id}`,
          method: 'PUT',
          body: data,
        }),
      }),

      deleteRepayment: builder.mutation({
        query: id => ({
          url: `repayments/${id}`,
          method: 'DELETE',
        }),
      }),

      // Personal Goals Routes
      getGoals: builder.query({
        query: () => ({
          url: 'goals',
          method: 'GET',
        }),
      }),

      getGoal: builder.query({
        query: id => ({
          url: `goals/${id}`,
          method: 'GET',
        }),
      }),

      createGoal: builder.mutation({
        query: data => ({
          url: 'goals',
          method: 'POST',
          body: data,
        }),
      }),

      updateGoal: builder.mutation({
        query: ({ id, data }) => ({
          url: `goals/${id}`,
          method: 'PUT',
          body: data,
        }),
      }),

      deleteGoal: builder.mutation({
        query: id => ({
          url: `goals/${id}`,
          method: 'DELETE',
        }),
      }),
    };
  },
});

export const {
  // Auth hooks
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,

  // User hooks
  useGetCurrentUserQuery,
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserStatisticsQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // Organization hooks
  useGetOrganizationsQuery,
  useGetOrganizationQuery,
  useRegisterOrganizationMutation,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetOrganizationStatisticsQuery,

  // Profile hooks
  useGetProfilesQuery,
  useGetMyProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,

  // Savings hooks
  useGetSavingsQuery,
  useGetMySavingsQuery,
  useCreateSavingMutation,
  useUpdateSavingMutation,
  useDeleteSavingMutation,

  // Loan hooks
  useGetLoansQuery,
  useGetMyLoansQuery,
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useDeleteLoanMutation,

  // Repayment hooks
  useGetRepaymentsQuery,
  useGetMyRepaymentsQuery,
  useCreateRepaymentMutation,
  useUpdateRepaymentMutation,
  useDeleteRepaymentMutation,

  // Goal hooks
  useGetGoalsQuery,
  useGetGoalQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
} = apiSlice;
