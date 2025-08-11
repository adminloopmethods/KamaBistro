"use client"

import { StyleObject } from '@/app/(editor)/_functionality/createElement';
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  MutableRefObject,
  ElementType,
  RefObject
} from 'react';

type RefType = HTMLElement | null;

type ContextRefType = {
  activeRef: RefType;
  setContextRef: React.Dispatch<React.SetStateAction<RefType>>;
  setReference: (ref: RefType) => void;
  clearReference: () => void;
};

type ContextElementType = {
  setElementSetter: React.Dispatch<React.SetStateAction<any>>;
  setElement: React.Dispatch<React.SetStateAction<any>>;
  clearElementSetter: () => void;
  setRmElementFunc: React.Dispatch<React.SetStateAction<() => void>>;
};

type WidthType = {
  currentWidth: string;
  setWidth: React.Dispatch<React.SetStateAction<string>>;
};

type WebsiteContentType = {
  content: any[];
  setContent: React.Dispatch<React.SetStateAction<any[]>>;
};

type FinalSubmitType = {
  id: string;
  submit: () => void;
};

type SubmissionObjectType = {
  finalSubmit: FinalSubmitType[];
  setFinalSubmit: React.Dispatch<React.SetStateAction<FinalSubmitType[]>>;
  setContent: React.Dispatch<React.SetStateAction<any[]>>;
};

interface ImageStyleToolbarProps {
  element: ElementType;
  style?: StyleObject;
  onStyleChange?: (style: StyleObject) => void; // optional callback if needed
  setElement: any;
  currentWidth: string;
  imageRef: RefObject<HTMLImageElement | null>;
  onClose: () => void
}

type MyContextType = {
  contextRef: ContextRefType;
  activeRef: RefType | any;
  contextElement: ContextElementType;
  element: any;
  elementSetter: any;
  rmElementFunc: (id: string) => void;
  width: WidthType;
  currentWidth: string;
  toolbarRef: any;
  websiteContent: WebsiteContentType;
  SubmissionObject: SubmissionObjectType;
  finalSubmit: FinalSubmitType[];
  imageContext: ImageStyleToolbarProps | Record<string, any> | null;
  setImageContext: React.Dispatch<React.SetStateAction<ImageStyleToolbarProps | Record<string, any> | null>>
  imageEdit: Boolean,
  setImageEdit: React.Dispatch<React.SetStateAction<Boolean>>
};

const MyFunctionContext = createContext<MyContextType | undefined>(undefined);

function Provider({ children }: { children: ReactNode }) {
  const [activeRef, setContextRef] = useState<RefType>(null);
  const [elementSetter, setElementSetter] = useState<any>(null);
  const [element, setElement] = useState<any>(null);
  const [currentWidth, setWidth] = useState<string>('');
  const [rmElementFunc, setRmElementFunc] = useState<() => void>(() => { });
  const [content, setContent] = useState<any[]>([]);
  const [finalSubmit, setFinalSubmit] = useState<FinalSubmitType[]>([]);
  const [imageContext, setImageContext] = useState<ImageStyleToolbarProps | Record<string, any> | null>(null)
  const [imageEdit, setImageEdit] = useState<Boolean>(false)


  const toolbarRef = useRef<HTMLElement | null>(null);

  const width: WidthType = {
    currentWidth,
    setWidth
  };

  const contextRef: ContextRefType = {
    activeRef,
    setContextRef,
    setReference: (ref: RefType) => setContextRef(ref),
    clearReference: () => setContextRef(null)
  };

  const contextElement: ContextElementType = {
    setElementSetter,
    setElement,
    clearElementSetter: () => setElementSetter({}),
    setRmElementFunc
  };

  const websiteContent: WebsiteContentType = {
    content,
    setContent
  };

  const SubmissionObject: SubmissionObjectType = {
    finalSubmit,
    setFinalSubmit,
    setContent
  };

  const ImageToolbarContext: ImageStyleToolbarProps | Record<string, any> = {

  }

  return (
    <MyFunctionContext.Provider
      value={{
        contextRef,
        activeRef,
        contextElement,
        element,
        elementSetter,
        rmElementFunc,
        width,
        currentWidth,
        toolbarRef,
        websiteContent,
        SubmissionObject,
        finalSubmit,
        imageContext,
        setImageContext,
        imageEdit,
        setImageEdit
      }}
    >
      {children}
    </MyFunctionContext.Provider>
  );
}

function useMyContext(): MyContextType {
  const context = useContext(MyFunctionContext);
  if (!context) {
    throw new Error('useMyContext must be used within a Provider');
  }
  return context;
}

export { Provider, useMyContext };
