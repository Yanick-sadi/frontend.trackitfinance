import { Card, CardContent } from '../../components/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/Table';
import { Skeleton } from '../../components/Skeleton';
import Empty from '../../components/Empty';
import Error from '../../components/Error';
import Layout from '../../layout';
import { useGetMySavingsQuery } from '../../redux/api/apiSlice';
import { format } from 'date-fns';
import { employeeNavLinks } from '../../constants';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/Dialog';
import { Button } from '../../components/Button';
import { useState } from 'react';

const EmployeeSavings = () => {
  const { data: savings, error, isLoading } = useGetMySavingsQuery({});
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState(null);

  // Skeleton loading component
  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
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

  return (
    <Layout navLinks={employeeNavLinks}>
      <div className='mx-4'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='font-bold text-xl text-gray-900'>My Savings ({savings?.data?.length || 0})</h3>
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
                            <Button variant='ghost' className='h-8 w-8 p-0' onClick={() => handleView(saving)}>
                              <Eye className='h-4 w-4' />
                              <span className='sr-only'>View details</span>
                            </Button>
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
      </div>
    </Layout>
  );
};

export default EmployeeSavings;
