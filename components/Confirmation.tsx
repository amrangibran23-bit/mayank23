
import React from 'react';
import Spinner from './Spinner';
import { CheckCircleIcon } from './IconComponents';

interface ConfirmationProps {
  isLoading: boolean;
  onReset: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ isLoading, onReset }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-12">
                <Spinner />
                <p className="mt-4 text-lg font-medium">Memproses pesanan Anda...</p>
            </div>
        );
    }
  
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pesanan Dikonfirmasi!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Terima kasih atas pesanan Anda. Foto Anda akan segera dicetak dan dikirim.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Pesan Lagi
      </button>
    </div>
  );
};

export default Confirmation;
