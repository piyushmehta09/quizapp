import { FiLoader } from 'react-icons/fi';

export default function Spinner() {
  return (
    <div className="flex justify-center py-20 text-indigo-500">
      <FiLoader className="animate-spin" size={32} />
    </div>
  );
}
