import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Context 타입 정의
interface FormContextType {
  content: string;
  setContent: (content: string) => void;
  clearContent: () => void;
  getContentLength: () => number;
}

// Context 생성
const FormContext = createContext<FormContextType | undefined>(undefined);

// FormProvider 컴포넌트
interface FormProviderProps {
  children: ReactNode;
}

export function FormProvider({ children }: FormProviderProps) {
  const [content, setContent] = useState<string>('');

  // 컨텐츠 초기화 함수
  const clearContent = () => {
    setContent('');
  };

  // 컨텐츠 길이 반환 함수
  const getContentLength = () => {
    return content.length;
  };

  // Context 값 정의
  const contextValue: FormContextType = {
    content,
    setContent,
    clearContent,
    getContentLength,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}

// useForm 커스텀 훅
export function useForm(): FormContextType {
  const context = useContext(FormContext);
  
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  
  return context;
}

// 추가적인 폼 상태 관리를 위한 확장된 Context (선택사항)
interface ExtendedFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isDraft: boolean;
  lastSaved: Date | null;
}

interface ExtendedFormContextType {
  formData: ExtendedFormData;
  updateField: <K extends keyof ExtendedFormData>(field: K, value: ExtendedFormData[K]) => void;
  resetForm: () => void;
  saveAsDraft: () => void;
}

const ExtendedFormContext = createContext<ExtendedFormContextType | undefined>(undefined);

const initialFormData: ExtendedFormData = {
  title: '',
  content: '',
  category: '',
  tags: [],
  isDraft: false,
  lastSaved: null,
};

export function ExtendedFormProvider({ children }: FormProviderProps) {
  const [formData, setFormData] = useState<ExtendedFormData>(initialFormData);

  const updateField = <K extends keyof ExtendedFormData>(
    field: K, 
    value: ExtendedFormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      lastSaved: new Date(),
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const saveAsDraft = () => {
    setFormData(prev => ({
      ...prev,
      isDraft: true,
      lastSaved: new Date(),
    }));
  };

  const contextValue: ExtendedFormContextType = {
    formData,
    updateField,
    resetForm,
    saveAsDraft,
  };

  return (
    <ExtendedFormContext.Provider value={contextValue}>
      {children}
    </ExtendedFormContext.Provider>
  );
}

export function useExtendedForm(): ExtendedFormContextType {
  const context = useContext(ExtendedFormContext);
  
  if (context === undefined) {
    throw new Error('useExtendedForm must be used within an ExtendedFormProvider');
  }
  
  return context;
}