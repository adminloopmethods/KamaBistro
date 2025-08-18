"use client"

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
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
  webpage: any;
  setWebpage: React.Dispatch<React.SetStateAction<any>>;
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
};

const MyFunctionContext = createContext<MyContextType | undefined>(undefined);

function Provider({ children }: { children: ReactNode }) {
  const [activeRef, setContextRef] = useState<RefType>(null);
  const [elementSetter, setElementSetter] = useState<any>(null);
  const [element, setElement] = useState<any>(null);
  const [currentWidth, setWidth] = useState<string>('');
  const [rmElementFunc, setRmElementFunc] = useState<() => void>(() => { });
  const [webpage, setWebpage] = useState<any[]>([]);
  const [finalSubmit, setFinalSubmit] = useState<FinalSubmitType[]>([]);

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
    webpage,
    setWebpage
  };

  const SubmissionObject: SubmissionObjectType = {
    finalSubmit,
    setFinalSubmit,
    setContent: setWebpage
  };

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
        finalSubmit
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
