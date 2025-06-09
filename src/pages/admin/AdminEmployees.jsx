import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../../redux/api/apiSlice';
import { format } from 'date-fns';
import { adminNavLinks } from '../../constants';
import { Edit, Trash2, Plus, Eye, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminEmployees = () => {
  const { data: users, error, isLoading, refetch } = useGetUsersQuery({});
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Filter users to get only employees
  const employees = useMemo(() => {
    if (!users?.data) return [];
    return users.data.filter(user => user.role === 'Employee');
  }, [users]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Separate form instances for create and edit
  const createForm = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      role: 'Employee',
      status: 'Active',
      position: '',
      salary: '',
      hireDate: '',
    },
    mode: 'onChange',
  });

  const editForm = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      role: 'Employee',
      status: 'Active',
      position: '',
      salary: '',
      hireDate: '',
    },
    mode: 'onChange',
  });

  // Reset forms when modals close
  useEffect(() => {
    if (!isCreateModalOpen) {
      createForm.reset({
        fullName: '',
        email: '',
        role: 'Employee',
        status: 'Active',
        position: '',
        salary: '',
        hireDate: '',
      });
    }
  }, [isCreateModalOpen, createForm]);

  useEffect(() => {
    if (!isEditModalOpen) {
      editForm.reset();
    }
  }, [isEditModalOpen, editForm]);

  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Salary</TableHead>
          <TableHead>Status</TableHead>
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
              <Skeleton className='h-4 w-32' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-20' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-20' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-20' />
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
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-yellow-100 text-yellow-800',
      Suspended: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusClasses[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  };

  const handleView = employee => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleEdit = employee => {
    setSelectedEmployee(employee);
    editForm.reset({
      fullName: employee.fullName || '',
      email: employee.email || '',
      role: employee.role || 'Employee',
      status: employee.status || 'Active',
      position: employee.profile?.position || '',
      salary: employee.profile?.salary?.toString() || '',
      hireDate: employee.profile?.hireDate ? new Date(employee.profile.hireDate).toISOString().split('T')[0] : '',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = employee => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsCreateModalOpen(true);
  };

  const onCreateSubmit = async data => {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        status: data.status,
        position: data.position,
        ...(data.salary && { salary: parseFloat(data.salary) }),
        ...(data.hireDate && { hireDate: data.hireDate }),
      };

      const res = await createUser(payload).unwrap();
      if (res.ok) {
        setIsCreateModalOpen(false);
        refetch();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const onEditSubmit = async data => {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        status: data.status,
        position: data.position,
        ...(data.salary && { salary: parseFloat(data.salary) }),
        ...(data.hireDate && { hireDate: data.hireDate }),
      };

      const res = await updateUser({ userId: selectedEmployee.id, data: payload }).unwrap();
      if (res.ok) {
        setIsEditModalOpen(false);
        refetch();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await deleteUser(selectedEmployee.id).unwrap();
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

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Form component that accepts form instance and onSubmit handler
  const EmployeeForm = ({ form, onSubmit, isSubmitting, submitText }) => (
    <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='fullName' className='text-sm font-medium text-gray-700'>
          Full Name <span className='text-red-500'>*</span>
        </Label>
        <Controller
          name='fullName'
          control={form.control}
          rules={{
            required: 'Full name is required',
            minLength: { value: 2, message: 'Minimum 2 characters' },
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: 'Only letters and spaces are allowed',
            },
          }}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                id='fullName'
                placeholder='Enter full name'
                className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                autoComplete='off'
              />
              {fieldState.error && <p className='text-red-500 text-xs mt-1'>{fieldState.error.message}</p>}
            </>
          )}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email' className='text-sm font-medium text-gray-700'>
          Email <span className='text-red-500'>*</span>
        </Label>
        <Controller
          name='email'
          control={form.control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                id='email'
                type='email'
                placeholder='Enter email address'
                className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                autoComplete='off'
              />
              {fieldState.error && <p className='text-red-500 text-xs mt-1'>{fieldState.error.message}</p>}
            </>
          )}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='position' className='text-sm font-medium text-gray-700'>
            Position <span className='text-red-500'>*</span>
          </Label>
          <Controller
            name='position'
            control={form.control}
            rules={{ required: 'Position is required' }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id='position'
                  placeholder='Enter position'
                  className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                  autoComplete='off'
                />
                {fieldState.error && <p className='text-red-500 text-xs mt-1'>{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='salary' className='text-sm font-medium text-gray-700'>
            Salary (Rwf)
          </Label>
          <Controller
            name='salary'
            control={form.control}
            rules={{
              min: { value: 0, message: 'Salary must be positive' },
            }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id='salary'
                  type='number'
                  step='0.01'
                  placeholder='Enter salary amount'
                  className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                  autoComplete='off'
                />
                {fieldState.error && <p className='text-red-500 text-xs mt-1'>{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='status' className='text-sm font-medium text-gray-700'>
            Status <span className='text-red-500'>*</span>
          </Label>
          <Controller
            name='status'
            control={form.control}
            rules={{ required: 'Status is required' }}
            render={({ field, fieldState }) => (
              <>
                <select
                  {...field}
                  id='status'
                  className={`w-full p-2 border rounded-md ${fieldState.error ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value='Active'>Active</option>
                  <option value='Inactive'>Inactive</option>
                  <option value='Suspended'>Suspended</option>
                </select>
                {fieldState.error && <p className='text-red-500 text-xs mt-1'>{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='hireDate' className='text-sm font-medium text-gray-700'>
            Hire Date
          </Label>
          <Controller
            name='hireDate'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id='hireDate'
                  type='date'
                  className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                />
                {fieldState.error && <p className='text-red-500 text-xs mt-1'>{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>
      </div>

      <div className='flex justify-end gap-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={form === createForm ? closeCreateModal : closeEditModal}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type='submit' className='bg-primary hover:bg-primary/80' disabled={isSubmitting}>
          {isSubmitting ? `${submitText}...` : submitText}
        </Button>
      </div>
    </form>
  );

  return (
    <Layout navLinks={adminNavLinks}>
      <div className='mx-4'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='font-bold text-xl text-gray-900'>Employees ({employees?.length || 0})</h3>
          <Button onClick={handleCreate} className='bg-primary hover:bg-primary/80'>
            <Plus className='w-4 h-4 mr-2' />
            Add Employee
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
                <Error description='Error loading employees' />
              </div>
            ) : !employees || !employees.length ? (
              <div className='p-6'>
                <Empty description='No employees found.' />
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <div className='min-w-full inline-block align-middle'>
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-gray-50/50'>
                        <TableHead className='font-semibold text-gray-700 w-16'>SN</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[180px]'>Name</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[200px]'>Email</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[120px]'>Position</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[120px]'>Salary</TableHead>
                        <TableHead className='font-semibold text-gray-700 min-w-[120px]'>Status</TableHead>
                        <TableHead className='font-semibold text-gray-700 w-16'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees?.map((employee, index) => (
                        <TableRow key={employee.id} className='hover:bg-gray-50/50 transition-colors'>
                          <TableCell className='font-medium text-gray-600'>{index + 1}</TableCell>
                          <TableCell className='font-medium text-gray-900'>{employee.fullName}</TableCell>
                          <TableCell className='text-gray-600'>{employee.email}</TableCell>
                          <TableCell className='text-gray-600'>{employee.profile?.position || 'N/A'}</TableCell>
                          <TableCell>
                            <span className='font-semibold text-green-600'>
                              Rwf {employee.profile?.salary?.toLocaleString() || '0'}
                            </span>
                          </TableCell>
                          <TableCell>{getStatusBadge(employee.status)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                  <span className='sr-only'>Open menu</span>
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => handleView(employee)}>
                                  <Eye className='mr-2 h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleEdit(employee)}>
                                  <Edit className='mr-2 h-4 w-4' />
                                  Edit Employee
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => handleDelete(employee)}
                                  className='text-red-600 focus:text-red-600'
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Delete Employee
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
        <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
          <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Create New Employee</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Fill in the details to create a new employee record.
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm
              form={createForm}
              onSubmit={onCreateSubmit}
              isSubmitting={createForm.formState.isSubmitting}
              submitText='Create Employee'
            />
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
          <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Edit Employee</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Update the details of this employee.
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm
              form={editForm}
              onSubmit={onEditSubmit}
              isSubmitting={editForm.formState.isSubmitting}
              submitText='Update Employee'
            />
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Employee Details</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Complete information about this employee.
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className='grid gap-6 py-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Full Name:</span>
                    <p className='text-sm text-gray-900'>{selectedEmployee.fullName}</p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Email:</span>
                    <p className='text-sm text-gray-900'>{selectedEmployee.email}</p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Position:</span>
                    <p className='text-sm text-gray-900'>{selectedEmployee.profile?.position || 'N/A'}</p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Salary:</span>
                    <p className='text-sm font-semibold text-green-600'>
                      Rwf {selectedEmployee.profile?.salary?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Hire Date:</span>
                    <p className='text-sm text-gray-900'>
                      {selectedEmployee.profile?.hireDate
                        ? format(new Date(selectedEmployee.profile.hireDate), 'PPP')
                        : 'N/A'}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Role:</span>
                    <p className='text-sm text-gray-900'>{selectedEmployee.role}</p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Status:</span>
                    <div className='text-sm'>{getStatusBadge(selectedEmployee.status)}</div>
                  </div>
                </div>
                <div className='space-y-1'>
                  <span className='text-sm font-medium text-gray-700'>Record Created:</span>
                  <p className='text-sm text-gray-900'>
                    {selectedEmployee.createdAt ? format(new Date(selectedEmployee.createdAt), 'PPpp') : 'N/A'}
                  </p>
                </div>
                {selectedEmployee.updatedAt && selectedEmployee.updatedAt !== selectedEmployee.createdAt && (
                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700'>Last Updated:</span>
                    <p className='text-sm text-gray-900'>{format(new Date(selectedEmployee.updatedAt), 'PPpp')}</p>
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
              <DialogTitle className='text-lg font-semibold text-red-600'>Delete Employee</DialogTitle>
              <DialogDescription className='text-sm text-gray-600'>
                Are you sure you want to delete this employee? This action cannot be undone and will permanently remove
                all associated data.
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

export default AdminEmployees;
