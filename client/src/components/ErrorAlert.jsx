const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 shadow-md animate-fade-in">
      <strong className="font-bold">오류! </strong>
      <span className="block sm:inline">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-500"
      >
        <span className="text-xl">&times;</span>
      </button>
    </div>
  );
};

export default ErrorAlert;
