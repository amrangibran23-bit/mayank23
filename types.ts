export interface UploadedFile {
  file: File;
  dataUrl: string;
  base64: string;
}

export interface PhotoAnalysisResult {
  isValid: boolean;
  issues: string[];
}

export interface OrderConfig {
  orderType: 'print' | 'id_photo';
  size: string;
  quantity: number;
  finish: 'Matte' | 'Glossy';
  backgroundColor: 'Original' | 'Red' | 'Blue' | 'White';
  costume: 'Original' | 'Kemeja Putih' | 'Jas Hitam';
}

export interface AppState {
  currentStep: number;
  uploadedFile: UploadedFile | null;
  analysisResult: PhotoAnalysisResult | null;
  enhancedImage: string | null; // base64 data URL
  orderConfig: OrderConfig;
  isLoading: boolean;
  error: string | null;
}
