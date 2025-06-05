import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Select';
import { Input } from '../../components/Input';
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
import {
  useGetRepaymentsQuery,
  useUpdateRepaymentMutation,
  useDeleteRepaymentMutation,
  useCreateRepaymentMutation,
  useGetLoansQuery,
} from '../../redux/api/apiSlice';
import { format } from 'date-fns';
import { adminNavLinks } from '../../constants';
import { Edit, Trash2, Plus, Eye, MoreVertical, DollarSign, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminRepayments = () => {
  const { data: repayments, error, isLoading, refetch } = useGetRepaymentsQuery({});
  const { data: loans } = useGetLoansQuery({});
  const [deleteRepayment] = useDeleteRepaymentMutation();
  const [createRepayment] = useCreateRepaymentMutation();
  const [updateRepayment] = useUpdateRepaymentMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRepayment, setSelectedRepayment] = useState(null);

  // React Hook Form setup for repayment creation/editing
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      loanId: '',
      amount: '',
      paymentDate: '',
    },
  });

  const watchedLoanId = watch('loanId');

  // Effect to set form values when editing
  useEffect(() => {
    if (selectedRepayment && isEditModalOpen) {
      setValue('loanId', selectedRepayment.loanId.toString());
      setValue('amount', selectedRepayment.amount);
      setValue(
        'paymentDate',
        selectedRepayment.paymentDate ? new Date(selectedRepayment.paymentDate).toISOString().slice(0, 16) : ''
      );
    }
  }, [selectedRepayment, isEditModalOpen, setValue]);

  // Skeleton loading component
  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Loan ID</TableHead>
          <TableHead>Borrower</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Date</TableHead>
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
              <Skeleton className='h-4 w-16' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-24' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-20' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-24' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-24' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const handleView = repayment => {
    setSelectedRepayment(repayment);
    setIsViewModalOpen(true);
  };

  const handleEdit = repayment => {
    setSelectedRepayment(repayment);
    reset({
      loanId: repayment.loanId.toString(),
      amount: repayment.amount,
      paymentDate: repayment.paymentDate ? new Date(repayment.paymentDate).toISOString().slice(0, 16) : '',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = repayment => {
    setSelectedRepayment(repayment);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRepayment(null);
    reset({
      loanId: '',
      amount: '',
      paymentDate: '',
    });
    setIsCreateModalOpen(true);
  };

  const onSubmit = async data => {
    try {
      const payload = {
        loanId: parseInt(data.loanId),
        amount: parseFloat(data.amount),
        paymentDate: new Date(data.paymentDate).toISOString(),
      };

      if (selectedRepayment) {
        const res = await updateRepayment({ id: selectedRepayment.id, data: payload }).unwrap();
        if (res.ok) {
          setIsEditModalOpen(false);
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await createRepayment(payload).unwrap();
        if (res.ok) {
          setIsCreateModalOpen(false);
          refetch();
          reset();
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await deleteRepayment(selectedRepayment.id).unwrap();
      if (res.ok) {
        setIsDeleteModalOpen(false);
        refetch();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    reset();
  };

  // Get loans based on context (create vs edit)
  const getAvailableLoans = () => {
    if (!loans?.data) return [];

    if (isEditModalOpen) {
      // For editing: allow both Approved and Repaid loans
      return loans.data.filter(loan => loan.status === 'Approved' || loan.status === 'Repaid');
    } else {
      // For creating: only allow Approved loans (not yet fully repaid)
      return loans.data.filter(loan => loan.status === 'Approved');
    }
  };

  const availableLoans = getAvailableLoans();

  const RepaymentForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='loanId' className='text-sm font-medium text-gray-700'>
          Loan <span className='text-red-500'>*</span>
        </Label>
        <Select
          value={watchedLoanId}
          onValueChange={value => setValue('loanId', value)}
          defaultValue={selectedRepayment?.loanId?.toString() || ''}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select a loan' />
          </SelectTrigger>
          <SelectContent>
            {availableLoans.length > 0 ? (
              availableLoans.map(loan => (
                <SelectItem key={loan.id} value={loan.id.toString()}>
                  Loan #{loan.id} - {loan.user?.fullName} (Rwf {loan.amount.toLocaleString()}) - {loan.status}
                </SelectItem>
              ))
            ) : (
              <SelectItem value='no-loans' disabled>
                {isEditModalOpen ? 'No loans available' : 'No approved loans available for repayment'}
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {errors.loanId && <p className='text-red-500 text-xs mt-1'>{errors.loanId.message}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='amount' className='text-sm font-medium text-gray-700'>
          Repayment Amount (Rwf) <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='amount'
          type='number'
          step='0.01'
          placeholder='Enter repayment amount'
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
          })}
          className={`w-full ${errors.amount ? 'border-red-500' : ''}`}
        />
        {errors.amount && <p className='text-red-500 text-xs mt-1'>{errors.amount.message}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='paymentDate' className='text-sm font-medium text-gray-700'>
          Payment Date <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='paymentDate'
          type='datetime-local'
          {...register('paymentDate', {
            required: 'Payment date is required',
          })}
          className={`w-full ${errors.paymentDate ? 'border-red-500' : ''}`}
        />
        {errors.paymentDate && <p className='text-red-500 text-xs mt-1'>{errors.paymentDate.message}</p>}
      </div>

      <div className='flex justify-end gap-3 pt-4'>
        <Button type='button' variant='outline' onClick={closeModal} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type='submit' className='bg-primary hover:bg-primary/80' disabled={isSubmitting}>
          {isSubmitting
            ? selectedRepayment
              ? 'Updating...'
              : 'Recording...'
            : selectedRepayment
            ? 'Update Repayment'
            : 'Record Repayment'}
        </Button>
      </div>
    </form>
  );

  return (
    <Layout navLinks={adminNavLinks}>
      <div className='mx-4'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='font-bold text-xl text-gray-900'>Loan Repayments ({repayments?.data?.length || 0})</h3>
          <Button onClick={handleCreate} className='bg-primary hover:bg-primary/80'>
            <Plus className='w-4 h-4 mr-2' />
            Record Repayment
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
                <Error description='Error loading repayments' />
              </div>
            ) : !repayments || !repayments.data?.length ? (
              <div className='p-6'>
                <Empty description='No repayments found.' />
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <div className='min-w-full inline-block align-middle'>
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-gray-50/50'>
                        <TableHead className='font-semibold text-gray-700 w-16'>SN</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[80px]'>Loan ID</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[150px]'>Borrower</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[120px]'>Amount</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[160px]'>Payment Date</TableHead>
                        <TableHead className='font-semibold text-gray-700 w-16'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repayments?.data?.map((repayment, index) => (
                        <TableRow key={repayment.id} className='hover:bg-gray-50/50 transition-colors'>
                          <TableCell className='font-medium text-gray-600'>{index + 1}</TableCell>
                          <TableCell>
                            <span className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>#{repayment.loanId}</span>
                          </TableCell>
                          <TableCell>
                            <div className='font-medium text-gray-900'>{repayment.loan?.user?.fullName || 'N/A'}</div>
                            {repayment.loan?.user?.email && (
                              <div className='text-sm text-gray-500 truncate max-w-[200px]'>
                                {repayment.loan.user.email}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className='font-semibold text-gray-900'>
                              Rwf {parseFloat(repayment.amount).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className='text-gray-500 text-sm'>
                            <div className='flex items-center'>
                              <Calendar className='w-4 h-4 mr-1' />
                              {format(new Date(repayment.paymentDate), 'MMM dd, yyyy HH:mm')}
                            </div>
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
                                <DropdownMenuItem onClick={() => handleView(repayment)}>
                                  <Eye className='mr-2 h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleEdit(repayment)}>
                                  <Edit className='mr-2 h-4 w-4' />
                                  Edit Repayment
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => handleDelete(repayment)}
                                  className='text-red-600 focus:text-red-600'
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Delete Repayment
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
              <DialogTitle className='text-lg font-semibold'>Record New Repayment</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Record a new loan repayment transaction.
              </DialogDescription>
            </DialogHeader>
            <RepaymentForm />
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={closeModal}>
          <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Edit Repayment</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>Update the repayment information.</DialogDescription>
            </DialogHeader>
            <RepaymentForm />
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Repayment Details</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Complete information about this repayment transaction.
              </DialogDescription>
            </DialogHeader>
            {selectedRepayment && (
              <div className='grid gap-6 py-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Loan ID:</span>
                    <p className='text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block'>
                      #{selectedRepayment.loanId}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Borrower:</span>
                    <p className='text-sm text-gray-900'>{selectedRepayment.loan?.user?.fullName || 'N/A'}</p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Repayment Amount:</span>
                    <p className='text-sm font-semibold text-gray-900'>
                      Rwf {parseFloat(selectedRepayment.amount).toLocaleString()}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Payment Date:</span>
                    <p className='text-sm text-gray-900'>{format(new Date(selectedRepayment.paymentDate), 'PPpp')}</p>
                  </div>
                </div>

                {/* Loan Information */}
                {selectedRepayment.loan && (
                  <div className='border-t pt-4'>
                    <h4 className='text-sm font-semibold text-gray-700 mb-3'>Related Loan Information</h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-1'>
                        <span className='text-xs font-medium text-gray-600'>Original Loan Amount:</span>
                        <p className='text-sm text-gray-900'>
                          Rwf {parseFloat(selectedRepayment.loan.amount).toLocaleString()}
                        </p>
                      </div>
                      <div className='space-y-1'>
                        <span className='text-xs font-medium text-gray-600'>Loan Status:</span>
                        <p className='text-sm text-gray-900'>{selectedRepayment.loan.status}</p>
                      </div>
                      {selectedRepayment.loan.reason && (
                        <div className='space-y-1 md:col-span-2'>
                          <span className='text-xs font-medium text-gray-600'>Loan Purpose:</span>
                          <p className='text-sm text-gray-900'>{selectedRepayment.loan.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
              <DialogTitle className='text-lg font-semibold text-red-600'>Delete Repayment</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Are you sure you want to delete this repayment record? This action cannot be undone and will permanently
                remove the transaction data.
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

export default AdminRepayments;
