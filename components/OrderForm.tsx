import React from 'react';
import { OrderConfig } from '../types';

interface OrderFormProps {
  photoUrl: string;
  config: OrderConfig;
  onUpdate: (newConfig: Partial<OrderConfig>) => void;
  onSubmit: () => void;
}

const PRINT_OPTIONS = [
    { id: '2R', label: '2R (6x9 cm)', price: 2500, description: 'Ukuran Dompet' },
    { id: '3R', label: '3R (8.9x12.7 cm)', price: 3000, description: 'Ukuran Standar' },
    { id: '4R', label: '4R (10.2x15.2 cm)', price: 3500, description: 'Ukuran Kartu Pos' },
    { id: '5R', label: '5R (12.7x17.8 cm)', price: 5000, description: 'Ukuran Sedang' },
    { id: '8R', label: '8R (20.3x25.4 cm)', price: 15000, description: 'Ukuran Besar' },
    { id: '10R', label: '10R (25.4x30.5 cm)', price: 25000, description: 'Ukuran Bingkai' },
];

const ID_PHOTO_OPTIONS = [
    { id: '4x6', label: '4x6 cm', price: 10000, description: 'Paket isi 4 foto' },
    { id: '3x4', label: '3x4 cm', price: 10000, description: 'Paket isi 6 foto' },
    { id: '2x3', label: '2x3 cm', price: 10000, description: 'Paket isi 9 foto' },
]

const FINISHES: ('Matte' | 'Glossy')[] = ['Matte', 'Glossy'];
const ORDER_TYPES = [
    { id: 'print', label: 'Cetak Foto' },
    { id: 'id_photo', label: 'Pas Foto' }
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
};

const OrderForm: React.FC<OrderFormProps> = ({ photoUrl, config, onUpdate, onSubmit }) => {

  const options = config.orderType === 'print' ? PRINT_OPTIONS : ID_PHOTO_OPTIONS;
  
  const handleOrderTypeChange = (type: 'print' | 'id_photo') => {
    const defaultSize = type === 'print' ? PRINT_OPTIONS[2].id : ID_PHOTO_OPTIONS[1].id; // Default to 4R or 3x4
    onUpdate({ orderType: type, size: defaultSize, quantity: 1 });
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, config.quantity + delta);
    onUpdate({ quantity: newQuantity });
  };
  
  const selectedOption = options.find(opt => opt.id === config.size);
  const pricePerItem = selectedOption ? selectedOption.price : 0;
  const totalPrice = pricePerItem * config.quantity;
  const quantityLabel = config.orderType === 'print' ? 'Lembar' : 'Paket';
  const priceLabel = config.orderType === 'print' ? 'Harga per lembar' : 'Harga per paket';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col items-center">
        <img src={photoUrl} alt="Final passport" className="rounded-lg shadow-lg w-full max-w-xs" />
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1 text-center">
            <p>Ini adalah pratinjau foto Anda.</p>
            {config.backgroundColor !== 'Original' && (
                <p>Latar Belakang: <span className="font-semibold text-blue-600 dark:text-blue-400">{config.backgroundColor}</span></p>
            )}
             {config.costume !== 'Original' && (
                <p>Kostum: <span className="font-semibold text-blue-600 dark:text-blue-400">{config.costume}</span></p>
            )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Pilih Jenis Cetak</h3>
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                {ORDER_TYPES.map(type => (
                    <button
                        key={type.id}
                        onClick={() => handleOrderTypeChange(type.id as 'print' | 'id_photo')}
                        className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${
                            config.orderType === type.id ? 'bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >{type.label}</button>
                ))}
            </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ukuran Cetak</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {options.map(option => (
              <button
                key={option.id}
                onClick={() => onUpdate({ size: option.id })}
                className={`w-full p-3 rounded-lg text-left border-2 transition-all flex justify-between items-center ${
                  config.size === option.id
                  ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500 ring-2 ring-blue-500'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{option.label}</p>
                    {option.description && <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>}
                </div>
                <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{formatCurrency(option.price)}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Jumlah</h3>
          <div className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 rounded-md">
            <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">-</button>
            <span className="font-semibold">{config.quantity} {quantityLabel}</span>
            <button onClick={() => handleQuantityChange(1)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">+</button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Finishing Kertas</h3>
          <div className="flex gap-3">
            {FINISHES.map(finish => (
              <button
                key={finish}
                onClick={() => onUpdate({ finish })}
                className={`flex-1 p-3 rounded-md text-sm font-medium border-2 transition-colors ${
                  config.finish === finish
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {finish}
              </button>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
            <div className="flex justify-between items-center text-md text-gray-600 dark:text-gray-400">
                <span>{priceLabel}:</span>
                <span>{formatCurrency(pricePerItem)}</span>
            </div>
            <div className="flex justify-between items-center text-md text-gray-600 dark:text-gray-400">
                <span>Jumlah:</span>
                <span>x {config.quantity}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total:</span>
                <span>{formatCurrency(totalPrice)}</span>
            </div>
        </div>

        <button
          onClick={onSubmit}
          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

export default OrderForm;