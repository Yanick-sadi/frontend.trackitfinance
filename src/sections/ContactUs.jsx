import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/form';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Button } from '../components/Button';

const ContactUs = () => {
  const form = useForm();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async values => {
    try {
      // Add actual submit logic here
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className='min-h-screen max-w-3xl mx-auto px-8 py-32' id='contact-us'>
      <h2 className='text-3xl mb-8 font-bold'>Need Additional Help?</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='Your name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='Your email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <FormField
              control={control}
              name='telephone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input type='tel' placeholder='Your phone number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='organization'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your organization' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name='subject'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject *</FormLabel>
                <FormControl>
                  <Input placeholder='Subject of your inquiry' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormLabel>How can we help? *</FormLabel>
                <FormControl>
                  <Textarea placeholder='Describe your issue or question' rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit Request'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactUs;
