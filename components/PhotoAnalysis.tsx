
import React, { useEffect } from 'react';
import { UploadedFile, PhotoAnalysisResult } from '../types';
import Spinner from './Spinner';
import { CheckCircleIcon, ExclamationTriangleIcon, SparklesIcon } from './IconComponents';

interface PhotoAnalysisProps {
  uploadedFile: UploadedFile | null;
  analysisResult: PhotoAnalysisResult | null;
  enhancedImage: string | null;
  onAnalyze: () => void;
  onEnhance: () => void;
  onProceed: () => void;
  isLoading: boolean;
  error: string | null;
}

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
            <h3 className="font-semibold text-green-800 dark:text-green-200">Photo meets requirements!</h3>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Potential Issues Found</h3>
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
      <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
        {isLoading && !displayImage && <Spinner />}
        {displayImage && <img src={displayImage} alt="Uploaded passport" className="w-full h-full object-cover" />}
      </div>
      
      {isLoading && <div className="text-center"><Spinner /> <p className="mt-2">AI is working...</p></div>}
      
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!isLoading && analysisResult && (
        <div className="space-y-4">
          {renderAnalysisResult()}
          <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onEnhance}
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Auto-fix Background
              </button>
            <button
              onClick={onProceed}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              Proceed to Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAnalysis;
