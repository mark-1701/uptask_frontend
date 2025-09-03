const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="my-4 bg-red-100 p-3 text-center text-sm font-bold text-red-600
        uppercase"
    >
      {children}
    </div>
  );
};

export default ErrorMessage;
