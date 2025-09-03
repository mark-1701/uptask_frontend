import { useState } from 'react';
import NewPasswordToken from '@/components/auth/NewPasswordToken';
import NewPasswordForm from '@/components/auth/NewPasswordForm';
import type { ConfirmToken } from '@/types/index';

const NewPasswordView = () => {
  const [token, setToken] = useState<ConfirmToken['token']>('');
  const [isValidToken, setIsValidToken] = useState(false);
  return (
    <>
      <h1 className="text-5xl font-black text-white">Reestablecer Password</h1>
      <p className="mt-5 text-2xl font-light text-white">
        Ingresa el código que recibiste {''}
        <span className="font-bold text-fuchsia-500"> por email</span>
      </p>

      {!isValidToken ? (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </>
  );
};

export default NewPasswordView;
