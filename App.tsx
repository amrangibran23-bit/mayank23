
import React, { useState, useCallback } from 'react';
import { AppState, PhotoAnalysisResult, OrderConfig, UploadedFile } from './types';
import Stepper from './components/Stepper';
import FileUpload from './components/FileUpload';
import PhotoAnalysis from './components/PhotoAnalysis';
import OrderForm from './components/OrderForm';
import Confirmation from './components/Confirmation';
import { analyzePassportPhoto, enhancePhotoBackground } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 1,
    uploadedFile: null,
    analysisResult: null,
    enhancedImage: null,
    orderConfig: {
      orderType: 'print',
      size: '4R',
      quantity: 1,
      finish: 'Matte',
      backgroundColor: 'Original',
    },
    isLoading: false,
    error: null,
  });

  const { currentStep, uploadedFile, analysisResult, enhancedImage, orderConfig, isLoading, error } = appState;

  const handleFileSelect = (file: UploadedFile) => {
    setAppState(prev => ({ ...prev, uploadedFile: file, currentStep: 2, analysisResult: null, enhancedImage: null, error: null }));
  };

  const handleAnalysis = useCallback(async () => {
    if (!uploadedFile) return;
    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await analyzePassportPhoto(uploadedFile.base64);
      setAppState(prev => ({ ...prev, analysisResult: result, isLoading: false }));
    } catch (e) {
      console.error(e);
      setAppState(prev => ({ ...prev, isLoading: false, error: 'Failed to analyze photo. Please try again.' }));
    }
  }, [uploadedFile]);

  const handleEnhancement = useCallback(async () => {
    if (!uploadedFile) return;
    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const newImageBase64 = await enhancePhotoBackground(uploadedFile.base64);
      setAppState(prev => ({ ...prev, enhancedImage: `data:image/png;base64,${newImageBase64}`, isLoading: false }));
    } catch (e) {
      console.error(e);
      setAppState(prev => ({ ...prev, isLoading: false, error: 'Failed to enhance photo. Please try again.' }));
    }
  }, [uploadedFile]);

  const handleProceedToOrder = () => {
    setAppState(prev => ({ ...prev, currentStep: 3 }));
  };
  
  const handleOrderUpdate = (newConfig: Partial<OrderConfig>) => {
    setAppState(prev => ({ ...prev, orderConfig: { ...prev.orderConfig, ...newConfig }}));
  };

  const handlePlaceOrder = () => {
    setAppState(prev => ({ ...prev, currentStep: 4, isLoading: true }));
     setTimeout(() => {
        setAppState(prev => ({ ...prev, isLoading: false }));
     }, 1500);
  };
  
  const handleReset = () => {
    setAppState({
      currentStep: 1,
      uploadedFile: null,
      analysisResult: null,
      enhancedImage: null,
      orderConfig: {
        orderType: 'print',
        size: '4R',
        quantity: 1,
        finish: 'Matte',
        backgroundColor: 'Original',
      },
      isLoading: false,
      error: null,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FileUpload onFileSelect={handleFileSelect} />;
      case 2:
        return (
          <PhotoAnalysis
            uploadedFile={uploadedFile}
            analysisResult={analysisResult}
            enhancedImage={enhancedImage}
            onAnalyze={handleAnalysis}
            onEnhance={handleEnhancement}
            onProceed={handleProceedToOrder}
            isLoading={isLoading}
            error={error}
          />
        );
      case 3:
        return (
          <OrderForm 
            photoUrl={enhancedImage || uploadedFile?.dataUrl || ''}
            config={orderConfig}
            onUpdate={handleOrderUpdate}
            onSubmit={handlePlaceOrder}
          />
        );
      case 4:
         return (
            <Confirmation 
                isLoading={isLoading}
                onReset={handleReset}
            />
         );
      default:
        return <FileUpload onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Asisten Cetak Foto <span className="text-blue-500">AI</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Unggah, analisis, dan sempurnakan pas foto Anda untuk dicetak.
          </p>
        </header>

        <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 transition-shadow duration-300">
          <Stepper currentStep={currentStep} />
          <div className="mt-8">
            {renderStep()}
          </div>
        </main>
        <footer className="text-center mt-8 text-gray-500 dark:text-gray-400">
            <p>Powered by Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
