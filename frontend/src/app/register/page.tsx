import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register - Blogi',
  description: 'Create a new Blogi account',
};

export default function RegisterPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create an Account</h1>
      <RegisterForm />
    </div>
  );
}