import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - Blogi',
  description: 'Login to your Blogi account',
};

export default function LoginPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Login to Your Account</h1>
      <LoginForm />
    </div>
  );
}