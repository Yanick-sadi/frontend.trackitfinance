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
  useGetSavingsQuery,
  useCreateSavingMutation,
  useUpdateSavingMutation,
  useDeleteSavingMutation,
  useGetUsersQuery,
} from '../../redux/api/apiSlice';
import { format } from 'date-fns';
import { adminNavLinks } from '../../constants';
import { Edit, Trash2, Plus, Eye, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSavings = () => {
  const { data: savings, error, isLoading, refetch } = useGetSavingsQuery({});
  const { data: users, isLoading: isUserLoading } = useGetUsersQuery({});
  const [createSaving] = useCreateSavingMutation();
  const [updateSaving] = useUpdateSavingMutation();
  const [deleteSaving] = useDeleteSavingMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState(null);

  // React Hook Form setup for saving creation/editing
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      amount: '',
      method: 'Manual',
      dateSaved: '',
    },
  });

  const watchedMethod = watch('method');

  // Skeleton loading component
  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Date Saved</TableHead>
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
              <Skeleton className='h-4 w-24' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-20' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-16' />
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

  const getMethodBadge = method => {
    const methodClasses = {
      'Manual': 'bg-blue-100 text-blue-800 border-blue-200',
      'Salary Deduction': 'bg-green-100 text-green-800 border-green-200',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          methodClasses[method] || 'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        {method}
      </span>
    );
  };

  const handleView = saving => {
    setSelectedSaving(saving);
    setIsViewModalOpen(true);
  };

  const handleEdit = saving => {
    setSelectedSaving(saving);
    reset({
      amount: saving.amount.toString(),
      method: saving.method,
      dateSaved: saving.dateSaved ? new Date(saving.dateSaved).toISOString().split('T')[0] : '',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = saving => {
    setSelectedSaving(saving);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSaving(null);
    reset({
      amount: '',
      method: 'Manual',
      dateSaved: '',
    });
    setIsCreateModalOpen(true);
  };

  const onSubmit = async data => {
    try {
      const payload = {
        amount: parseFloat(data.amount),
        method: data.method,
        bodyUserId: data.bodyUserId,
        dateSaved: data.dateSaved,
      };

      if (selectedSaving) {
        const res = await updateSaving({ id: selectedSaving.id, data: payload }).unwrap();
        if (res.ok) {
          setIsEditModalOpen(false);
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await createSaving(payload).unwrap();
        if (res.ok) {
          setIsCreateModalOpen(false);
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      }

      refetch();
      reset();
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSaving(selectedSaving.id).unwrap();
      setIsDeleteModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting saving:', error);
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    reset();
  };

  const SavingForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='employee' className='text-sm font-medium text-gray-700'>
          Employee <span className='text-red-500'>*</span>
        </Label>
        <Select
          onValueChange={value => {
            console.log('Selected value:', value);
            setValue('bodyUserId', value);
          }}
          disabled={isUserLoading || error}
        >
          <SelectTrigger className='w-full'>
            <SelectValue
              placeholder={
                isUserLoading ? 'Loading employees...' : error ? 'Error loading employees' : 'Select an employee'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {users?.data?.length > 0
              ? users.data.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.fullName}
                  </SelectItem>
                ))
              : !isUserLoading &&
                !error && (
                  <SelectItem value='' disabled>
                    No employees found
                  </SelectItem>
                )}
          </SelectContent>
        </Select>
        {errors.bodyUserId && <p className='text-red-500 text-xs mt-1'>{errors.bodyUserId.message}</p>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='amount' className='text-sm font-medium text-gray-700'>
          Amount (Rwf) <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='amount'
          type='number'
          step='0.01'
          placeholder='Enter saving amount'
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
          })}
          className={`w-full ${errors.amount ? 'border-red-500' : ''}`}
        />
        {errors.amount && <p className='text-red-500 text-xs mt-1'>{errors.amount.message}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='method' className='text-sm font-medium text-gray-700'>
          Saving Method <span className='text-red-500'>*</span>
        </Label>
        <Select value={watchedMethod} onValueChange={value => setValue('method', value)}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select saving method' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Manual'>Manual</SelectItem>
            <SelectItem value='Salary Deduction'>Salary Deduction</SelectItem>
          </SelectContent>
        </Select>
        {errors.method && <p className='text-red-500 text-xs mt-1'>{errors.method.message}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='dateSaved' className='text-sm font-medium text-gray-700'>
          Date Saved <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='dateSaved'
          type='date'
          {...register('dateSaved', {
            required: 'Date saved is required',
          })}
          className={`w-full ${errors.dateSaved ? 'border-red-500' : ''}`}
        />
        {errors.dateSaved && <p className='text-red-500 text-xs mt-1'>{errors.dateSaved.message}</p>}
      </div>

      <div className='flex justify-end gap-3 pt-4'>
        <Button type='button' variant='outline' onClick={closeModal} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type='submit' className='bg-primary hover:bg-primary/80' disabled={isSubmitting}>
          {isSubmitting
            ? selectedSaving
              ? 'Updating...'
              : 'Creating...'
            : selectedSaving
            ? 'Update Saving'
            : 'Create Saving'}
        </Button>
      </div>
    </form>
  );

  return (
    <Layout navLinks={adminNavLinks}>
      <div className='mx-4'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='font-bold text-xl text-gray-900'>Savings Records ({savings?.data?.length || 0})</h3>
          <Button onClick={handleCreate} className='bg-primary hover:bg-primary/80'>
            <Plus className='w-4 h-4 mr-2' />
            Add Saving
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
                <Error description='Error loading savings records' />
              </div>
            ) : !savings || !savings.data.length ? (
              <div className='p-6'>
                <Empty description='No savings records found.' />
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <div className='min-w-full inline-block align-middle'>
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-gray-50/50'>
                        <TableHead className='font-semibold text-gray-700 w-16'>SN</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[150px]'>User</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[120px]'>Amount</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[100px]'>Method</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[120px]'>Date Saved</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[160px]'>Created At</TableHead>
                        <TableHead className='font-semibold text-gray-700 w-16'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savings?.data?.map((saving, index) => (
                        <TableRow key={saving.id} className='hover:bg-gray-50/50 transition-colors'>
                          <TableCell className='font-medium text-gray-600'>{index + 1}</TableCell>
                          <TableCell>
                            <div className='font-medium text-gray-900'>{saving.user?.fullName || 'N/A'}</div>
                            {saving.user?.email && (
                              <div className='text-sm text-gray-500 truncate max-w-[200px]'>{saving.user.email}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className='font-semibold text-green-600'>Rwf {saving.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>{getMethodBadge(saving.method)}</TableCell>
                          <TableCell className='text-gray-600'>
                            {saving.dateSaved ? format(new Date(saving.dateSaved), 'MMM dd, yyyy') : 'N/A'}
                          </TableCell>
                          <TableCell className='text-gray-500 text-sm'>
                            {saving.createdAt ? format(new Date(saving.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
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
                                <DropdownMenuItem onClick={() => handleView(saving)}>
                                  <Eye className='mr-2 h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleEdit(saving)}>
                                  <Edit className='mr-2 h-4 w-4' />
                                  Edit Saving
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => handleDelete(saving)}
                                  className='text-red-600 focus:text-red-600'
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Delete Saving
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
              <DialogTitle className='text-lg font-semibold'>Create New Saving Record</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Fill in the details to create a new saving record.
              </DialogDescription>
            </DialogHeader>
            <SavingForm />
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={closeModal}>
          <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Edit Saving Record</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Update the details of this saving record.
              </DialogDescription>
            </DialogHeader>
            <SavingForm />
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Saving Record Details</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Complete information about this saving record.
              </DialogDescription>
            </DialogHeader>
            {selectedSaving && (
              <div className='grid gap-6 py-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Saver:</span>
                    <p className='text-sm text-gray-900'>{selectedSaving.user?.fullName || 'N/A'}</p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Email:</span>
                    <p className='text-sm text-gray-900'>{selectedSaving.user?.email || 'N/A'}</p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Amount Saved:</span>
                    <p className='text-sm font-semibold text-green-600'>Rwf {selectedSaving.amount.toLocaleString()}</p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Saving Method:</span>
                    <div>{getMethodBadge(selectedSaving.method)}</div>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Date Saved:</span>
                    <p className='text-sm text-gray-900'>
                      {selectedSaving.dateSaved ? format(new Date(selectedSaving.dateSaved), 'PPP') : 'N/A'}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Record Created:</span>
                    <p className='text-sm text-gray-900'>
                      {selectedSaving.createdAt ? format(new Date(selectedSaving.createdAt), 'PPpp') : 'N/A'}
                    </p>
                  </div>
                </div>
                {selectedSaving.updatedAt && selectedSaving.updatedAt !== selectedSaving.createdAt && (
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Last Updated:</span>
                    <p className='text-sm text-gray-900'>{format(new Date(selectedSaving.updatedAt), 'PPpp')}</p>
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
              <DialogTitle className='text-lg font-semibold text-red-600'>Delete Saving Record</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Are you sure you want to delete this saving record? This action cannot be undone and will permanently
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

export default AdminSavings;
