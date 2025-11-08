import React, { useEffect } from 'react';
import { UploadedFile, PhotoAnalysisResult } from '../types';
import Spinner from './Spinner';
import { CheckCircleIcon, ExclamationTriangleIcon, PaintBrushIcon, ShirtIcon } from './IconComponents';

interface PhotoAnalysisProps {
  uploadedFile: UploadedFile | null;
  analysisResult: PhotoAnalysisResult | null;
  enhancedImage: string | null;
  onAnalyze: () => void;
  onEnhance: (type: 'background' | 'costume', value: any) => void;
  onProceed: () => void;
  isLoading: boolean;
  error: string | null;
}

const BACKGROUND_OPTIONS: ('Red' | 'Blue' | 'White')[] = ['Red', 'Blue', 'White'];
const COSTUME_OPTIONS: ('Kemeja Putih' | 'Jas Hitam')[] = ['Kemeja Putih', 'Jas Hitam'];

const PhotoAnalysis: React.FC<PhotoAnalysisProps> = ({
  uploadedFile,
  analysisResult,
  enhancedImage,
  onAnalyze,
  onEnhance,
  onProceed,
  isLoading,
  error,
}) => {
  useEffect(() => {
    if (uploadedFile && !analysisResult && !isLoading && !error) {
      onAnalyze();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFile, analysisResult]);

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    if (analysisResult.isValid) {
      return (
        <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
            <h3 className="font-semibold text-green-800 dark:text-green-200">Foto memenuhi syarat!</h3>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Potensi Masalah Ditemukan</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
              {analysisResult.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  const displayImage = enhancedImage || uploadedFile?.dataUrl;

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {isLoading && <Spinner />}
        {!isLoading && displayImage && <img src={displayImage} alt="Uploaded passport" className="w-full h-full object-cover" />}
        {!displayImage && !isLoading && <p>Pratinjau Foto</p>}
      </div>
      
      {isLoading && <div className="text-center"><p className="mt-2">AI sedang bekerja, mohon tunggu...</p></div>}
      
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!isLoading && analysisResult && (
        <div className="space-y-6">
          {renderAnalysisResult()}
          
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center"><PaintBrushIcon className="w-5 h-5 mr-2 text-blue-500"/>Ganti Latar Belakang AI</h3>
            <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_OPTIONS.map(color => (
                    <button key={color} onClick={() => onEnhance('background', color)} className="p-3 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                        <span className={`w-4 h-4 rounded-full ${color === 'Red' ? 'bg-red-600' : color === 'Blue' ? 'bg-blue-600' : 'bg-white border'}`}></span>
                        {color}
                    </button>
                ))}
            </div>
          </div>
          
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center"><ShirtIcon className="w-5 h-5 mr-2 text-blue-500"/>Ganti Kostum AI</h3>
            <div className="grid grid-cols-2 gap-2">
                {COSTUME_OPTIONS.map(costume => (
                    <button key={costume} onClick={() => onEnhance('costume', costume)} className="p-3 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        {costume}
                    </button>
                ))}
            </div>
          </div>

          <button
            onClick={onProceed}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            Lanjutkan ke Pemesanan
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoAnalysis;
