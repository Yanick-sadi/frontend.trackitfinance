import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/Table';
import { Skeleton } from '../../components/Skeleton';
import Empty from '../../components/Empty';
import Error from '../../components/Error';
import Layout from '../../layout';
import { useGetMyRepaymentsQuery } from '../../redux/api/apiSlice';
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

const EmployeeRepayments = () => {
  const { data: repayments, error, isLoading } = useGetMyRepaymentsQuery({});
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRepayment, setSelectedRepayment] = useState(null);

  // Skeleton loading component
  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Loan ID</TableHead>
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

  return (
    <Layout navLinks={employeeNavLinks}>
      <div className='mx-4'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='font-bold text-xl text-gray-900'>My Repayments ({repayments?.data?.length || 0})</h3>
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
                            <span className='font-semibold text-gray-900'>
                              Rwf {parseFloat(repayment.amount).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className='text-gray-500 text-sm'>
                            {format(new Date(repayment.paymentDate), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            <Button variant='ghost' className='h-8 w-8 p-0' onClick={() => handleView(repayment)}>
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
      </div>
    </Layout>
  );
};

export default EmployeeRepayments;
