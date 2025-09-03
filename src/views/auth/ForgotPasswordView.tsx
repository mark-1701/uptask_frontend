import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { forgotPassword } from '@/api/AuthAPI';
import ErrorMessage from '@/components/ErrorMessage';
import type { ForgotPasswordForm } from '@/types/index';

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: ''
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: forgotPassword,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: data => {
      toast.success(data);
      reset();
    }
  });

  const handleForgotPassword = (formData: ForgotPasswordForm) =>
    mutate(formData);

  return (
    <>
      <h1 className="text-5xl font-black text-white">Reestablecer Password</h1>
      <p className="mt-5 text-2xl font-light text-white">
        ¿Olvidaste tu password? coloca tu email {''}
        <span className="font-bold text-fuchsia-500">
          {' '}
          y reestablece tu password
        </span>
      </p>

      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className="mt-10 space-y-8 bg-white p-10"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="text-2xl font-normal" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full border border-gray-300 p-3"
            {...register('email', {
              required: 'El Email de registro es obligatorio',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'E-mail no válido'
              }
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          value="Enviar Instrucciones"
          className="w-full cursor-pointer bg-fuchsia-600 p-3 text-xl font-black
            text-white hover:bg-fuchsia-700"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/login"
          className="text-center font-normal text-gray-300"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>

        <Link
          to="/auth/register"
          className="text-center font-normal text-gray-300"
        >
          ¿No tienes cuenta? Crea una
        </Link>
      </nav>
    </>
  );
}
