import React from 'react';
import Spinner from './Spinner';
import { CheckCircleIcon, WhatsAppIcon } from './IconComponents';
import { OrderConfig } from '../types';

interface ConfirmationProps {
  isLoading: boolean;
  onReset: () => void;
  orderConfig: OrderConfig;
}

const Confirmation: React.FC<ConfirmationProps> = ({ isLoading, onReset, orderConfig }) => {
    
    const handleWhatsAppRedirect = () => {
        const { orderType, size, quantity, finish, backgroundColor, costume } = orderConfig;
        
        let message = `*Pesanan Baru dari Aplikasi Foto AI*\n\n`;
        message += `*Jenis Cetak:* ${orderType === 'id_photo' ? 'Pas Foto' : 'Cetak Foto'}\n`;
        message += `*Ukuran:* ${size}\n`;
        message += `*Jumlah:* ${quantity} ${orderType === 'id_photo' ? 'Paket' : 'Lembar'}\n`;
        message += `*Finishing:* ${finish}\n`;
        if (backgroundColor !== 'Original') {
            message += `*Latar Belakang:* ${backgroundColor}\n`;
        }
        if (costume !== 'Original') {
            message += `*Kostum:* ${costume}\n`;
        }
        message += `\nMohon untuk diproses. Terima kasih!`;

        // Ganti dengan nomor WhatsApp tujuan Anda (gunakan format internasional tanpa '+' atau spasi)
        const phoneNumber = '6281234567890'; 

        const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

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
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Terima kasih! Langkah selanjutnya adalah mengirim detail pesanan Anda kepada kami melalui WhatsApp.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <button
          onClick={handleWhatsAppRedirect}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5 mr-2"/>
          Kirim via WhatsApp
        </button>
        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Pesan Lagi
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
