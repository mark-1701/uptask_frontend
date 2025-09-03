import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { changePassword } from '@/api/ProfileAPI';
import ErrorMessage from '@/components/ErrorMessage';
import type { UpdateCurrentUserPasswordForm } from '@/types/index';

export default function ChangePasswordView() {
  const initialValues: UpdateCurrentUserPasswordForm = {
    current_password: '',
    password: '',
    password_confirmation: ''
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ defaultValues: initialValues });

  const password = watch('password');

  const { mutate } = useMutation({
    mutationFn: changePassword,
    onError: error => toast.error(error.message),
    onSuccess: data => toast.success(data)
  });

  const handleChangePassword = (formData: UpdateCurrentUserPasswordForm) =>
    mutate(formData);

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-black">Cambiar Password</h1>
        <p className="mt-5 text-2xl font-light text-gray-500">
          Utiliza este formulario para cambiar tu password
        </p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="mt-14 space-y-5 rounded-lg bg-white p-10 shadow-lg"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-sm font-bold uppercase"
              htmlFor="current_password"
            >
              Password Actual
            </label>
            <input
              id="current_password"
              type="password"
              placeholder="Password Actual"
              className="w-full border border-gray-200 p-3"
              {...register('current_password', {
                required: 'El password actual es obligatorio'
              })}
            />
            {errors.current_password && (
              <ErrorMessage>{errors.current_password.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm font-bold uppercase" htmlFor="password">
              Nuevo Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Nuevo Password"
              className="w-full border border-gray-200 p-3"
              {...register('password', {
                required: 'El Nuevo Password es obligatorio',
                minLength: {
                  value: 8,
                  message: 'El Password debe ser mínimo de 8 caracteres'
                }
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-sm font-bold uppercase"
            >
              Repetir Password
            </label>

            <input
              id="password_confirmation"
              type="password"
              placeholder="Repetir Password"
              className="w-full border border-gray-200 p-3"
              {...register('password_confirmation', {
                required: 'Este campo es obligatorio',
                validate: value =>
                  value === password || 'Los Passwords no son iguales'
              })}
            />
            {errors.password_confirmation && (
              <ErrorMessage>
                {errors.password_confirmation.message}
              </ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value="Cambiar Password"
            className="w-full cursor-pointer bg-fuchsia-600 p-3 font-bold
              text-white uppercase transition-colors hover:bg-fuchsia-700"
          />
        </form>
      </div>
    </>
  );
}
