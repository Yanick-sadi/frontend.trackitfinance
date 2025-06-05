import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '../../components/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/Table';
import { Skeleton } from '../../components/Skeleton';
import { Button } from '../../components/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/Dialog';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Label } from '../../components/Label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/DropdownMenu';
import Empty from '../../components/Empty';
import Error from '../../components/Error';
import Layout from '../../layout';
import { useGetMyLoansQuery, useDeleteLoanMutation, useCreateLoanMutation } from '../../redux/api/apiSlice';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/Tooltip';
import { format } from 'date-fns';
import { employeeNavLinks } from '../../constants';
import { Edit, Trash2, Plus, Eye, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';

const EmployeeLoans = () => {
  const { data: loans, error, isLoading, refetch } = useGetMyLoansQuery({});
  const [deleteLoan] = useDeleteLoanMutation();
  const [createLoan] = useCreateLoanMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // React Hook Form setup for loan creation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      amount: '',
      reason: '',
    },
  });

  // Skeleton loading component
  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Approved At</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(8)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className='h-4 w-8' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-20' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-16' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-32' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-24' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-32' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-24' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const getStatusBadge = status => {
    const statusClasses = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Approved: 'bg-blue-100 text-blue-800 border-blue-200',
      Rejected: 'bg-red-100 text-red-800 border-red-200',
      Repaid: 'bg-green-100 text-green-800 border-green-200',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        {status}
      </span>
    );
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleView = loan => {
    setSelectedLoan(loan);
    setIsViewModalOpen(true);
  };

  const handleDelete = loan => {
    setSelectedLoan(loan);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedLoan(null);
    reset({
      amount: '',
      reason: '',
    });
    setIsCreateModalOpen(true);
  };

  const onSubmit = async data => {
    try {
      const payload = {
        amount: parseFloat(data.amount),
        reason: data.reason,
      };

      await createLoan(payload).unwrap();
      setIsCreateModalOpen(false);
      refetch();
      reset();
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteLoan(selectedLoan.id).unwrap();
      setIsDeleteModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    reset();
  };

  const LoanForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='amount' className='text-sm font-medium text-gray-700'>
          Amount (Rwf) <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='amount'
          type='number'
          step='0.01'
          placeholder='Enter loan amount'
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
          })}
          className={`w-full ${errors.amount ? 'border-red-500' : ''}`}
        />
        {errors.amount && <p className='text-red-500 text-xs mt-1'>{errors.amount.message}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='reason' className='text-sm font-medium text-gray-700'>
          Reason <span className='text-red-500'>*</span>
        </Label>
        <Textarea
          id='reason'
          placeholder='Enter reason for loan application'
          {...register('reason', {
            required: 'Reason is required',
            minLength: { value: 10, message: 'Reason must be at least 10 characters' },
          })}
          className={`w-full resize-none ${errors.reason ? 'border-red-500' : ''}`}
          rows={4}
        />
        {errors.reason && <p className='text-red-500 text-xs mt-1'>{errors.reason.message}</p>}
      </div>

      <div className='flex justify-end gap-3 pt-4 '>
        <Button type='button' variant='outline' onClick={closeModal} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type='submit' className='bg-primary hover:bg-primary/80' disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Loan'}
        </Button>
      </div>
    </form>
  );

  return (
    <Layout navLinks={employeeNavLinks}>
      <div className='mx-4'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='font-bold text-xl text-gray-900'>My Loan Applications ({loans?.data?.length || 0})</h3>
          <Button onClick={handleCreate} className='bg-primary hover:bg-primary/80'>
            <Plus className='w-4 h-4 mr-2' />
            Request Loan
          </Button>
        </div>

        <Card className='shadow-sm border-0'>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='overflow-x-auto'>
                <div className='min-w-full inline-block align-middle'>
                  <TableSkeleton />
                </div>
              </div>
            ) : error ? (
              <div className='p-6'>
                <Error description='Error loading loan applications' />
              </div>
            ) : !loans || !loans.data.length ? (
              <div className='p-6'>
                <Empty description='No loan applications found.' />
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <div className='min-w-full inline-block align-middle'>
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-gray-50/50'>
                        <TableHead className='font-semibold text-gray-700 w-16'>SN</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[120px]'>Amount</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[100px]'>Status</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[200px]'>Reason</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[120px]'>Approved At</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[160px]'>Created At</TableHead>
                        <TableHead className='font-semibold text-gray-700 w-16'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loans?.data?.map((loan, index) => (
                        <TableRow key={loan.id} className='hover:bg-gray-50/50 transition-colors'>
                          <TableCell className='font-medium text-gray-600'>{index + 1}</TableCell>
                          <TableCell>
                            <span className='font-semibold text-gray-900'>Rwf {loan.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>{getStatusBadge(loan.status)}</TableCell>
                          <TableCell className='text-gray-600'>
                            {loan.reason && loan.reason.length > 50 ? (
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className='text-left hover:text-gray-800 transition-colors'>
                                      {truncateText(loan.reason)}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side='top' className='max-w-[300px]'>
                                    <p className='whitespace-pre-wrap'>{loan.reason}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              loan.reason || 'N/A'
                            )}
                          </TableCell>
                          <TableCell className='text-gray-600'>
                            {loan.approvedAt ? format(new Date(loan.approvedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                          </TableCell>
                          <TableCell className='text-gray-500 text-sm'>
                            {loan.createdAt ? format(new Date(loan.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                  <span className='sr-only'>Open menu</span>
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => handleView(loan)}>
                                  <Eye className='mr-2 h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => handleDelete(loan)}
                                  className='text-red-600 focus:text-red-600'
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Delete Loan
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={closeModal}>
          <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Create New Loan Application</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Fill in the details to create a new loan application.
              </DialogDescription>
            </DialogHeader>
            <LoanForm />
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Loan Application Details</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Complete information about this loan application.
              </DialogDescription>
            </DialogHeader>
            {selectedLoan && (
              <div className='grid gap-6 py-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Amount Requested:</span>
                    <p className='text-sm font-semibold text-gray-900'>Rwf {selectedLoan.amount.toLocaleString()}</p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Current Status:</span>
                    <div>{getStatusBadge(selectedLoan.status)}</div>
                  </div>
                </div>
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-gray-700'>Application Reason:</span>
                  <p className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap'>
                    {selectedLoan.reason || 'No reason provided'}
                  </p>
                </div>
                {selectedLoan.rejectionReason && (
                  <div className='space-y-2'>
                    <span className='text-sm font-medium text-gray-700'>Rejection Reason:</span>
                    <p className='text-sm text-gray-600 bg-red-50 p-3 rounded-lg whitespace-pre-wrap'>
                      {selectedLoan.rejectionReason}
                    </p>
                  </div>
                )}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Application Date:</span>
                    <p className='text-sm text-gray-900'>{format(new Date(selectedLoan.createdAt), 'PPpp')}</p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Decision Date:</span>
                    <p className='text-sm text-gray-900'>
                      {selectedLoan.approvedAt ? format(new Date(selectedLoan.approvedAt), 'PPpp') : 'Pending decision'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold text-red-600'>Delete Loan Application</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Are you sure you want to delete this loan application? This action cannot be undone and will permanently
                remove all associated data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='flex gap-3 pt-4'>
              <Button variant='outline' onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant='destructive' onClick={handleDeleteConfirm}>
                Delete Permanently
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default EmployeeLoans;
