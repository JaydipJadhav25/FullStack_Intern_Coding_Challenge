import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import FormField from '../../components/FormField';

export default function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log('form data:', data);

      await signup(data);

      toast.success('Account created successfully!');
      navigate('/stores');

    } catch (err) {

      toast.error(
        err.response?.data?.message || 'Signup failed. Please try again.'
      );
      
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-brand-700">
            Plate <span className="text-amber-500">★</span> Rated
          </h1>
          <p className="mt-1 text-sm text-gray-500">Create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Full name"
            placeholder="At least 20 characters"
            required
            error={errors.name?.message}
            {...register('name', {
              required: 'Name is required',
              validate: (value) =>
                value.trim().length >= 20 && value.trim().length <= 60
                  ? true
                  : 'Name must be between 20 and 60 characters',
            })}
          />

          <FormField
            label="Email"
            type="email"
            required
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email address',
              },
            })}
          />

          <FormField
            label="Address"
            required
            error={errors.address?.message}
            {...register('address', {
              required: 'Address is required',
              validate: (value) =>
                value.trim().length > 0 && value.length <= 400
                  ? true
                  : 'Address is required and must be at most 400 characters',
            })}
          />

          <FormField
            label="Password"
            type="password"
            placeholder="8-16 chars, 1 uppercase, 1 special"
            required
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              validate: (value) => {
                if (value.length < 8 || value.length > 16) {
                  return 'Password must be 8-16 characters';
                }

                if (!/[A-Z]/.test(value)) {
                  return 'Password must contain at least one uppercase letter';
                }

                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                  return 'Password must contain at least one special character';
                }

                return true;
              },
            })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-brand-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}