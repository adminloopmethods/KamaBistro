"use client"

import { StyleObject } from '@/app/(editor)/_functionality/createElement';
// import { ResponsiveStyles, SectionElementType } from '@/app/(editor)/_functionality/createSection';
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  MutableRefObject,
  ElementType,
  RefObject,
  CSSProperties
} from 'react';
import { stringFunctionType } from './ContextTypes';
import { ElementTypeCustom } from '@/app/(editor)/_component/Elements/Section';

type RefType = HTMLElement | null;

export type screenType = "xl" | "lg" | "md" | "sm";

export type webpageType = {
  id: string,
  locationId?: string | null,
  name: string,
  route: string,
  contents: any[],
  createdAt: string,
  updatedAt: string,
  editedWidth: string,
}

type ContextRefType = {
  activeRef: RefType;
  setContextRef: React.Dispatch<React.SetStateAction<RefType>>;
  setReference: (ref: RefType) => void;
  clearReference: () => void;
};


type WebsiteContentType = {
  webpage: webpageType | null;
  setWebpage: React.Dispatch<React.SetStateAction<webpageType | null>>;
};

interface SectionContextType {
  currentSection: React.CSSProperties,
  setCurrentSection: React.Dispatch<React.SetStateAction<React.CSSProperties>>,
  currentSectionSetter: React.Dispatch<React.SetStateAction<React.CSSProperties>>,
  setCurrentSectionSetter: React.Dispatch<React.SetStateAction<() => void>>,
  rmSection: () => void,
  setRmSection: React.Dispatch<React.SetStateAction<() => void>>,
  sectionRef: React.RefObject<HTMLElement | null> | null,
  setSectionRef: React.Dispatch<React.SetStateAction<React.RefObject<HTMLElement | null> | null>>
  sectionGivenNameFn: (value: string) => void,
  setSectionGivenName: React.Dispatch<React.SetStateAction<(value: string) => void>>,
  setSectionName: React.Dispatch<React.SetStateAction<string>>,
  sectionName: string
}


type ContextElementType = {
  setElementSetter: React.Dispatch<React.SetStateAction<any>>;
  setElement: React.Dispatch<React.SetStateAction<any>>;
  clearElementSetter: () => void;
  setRmElementFunc: React.Dispatch<React.SetStateAction<() => void>>;
};

type WidthType = {
  widthValue: string;
  setWidthValue: React.Dispatch<React.SetStateAction<string>>;
  activeScreen: screenType;
  setActiveScreen: React.Dispatch<React.SetStateAction<screenType>>;
};

type FinalSubmitType = {
  id: string;
  submit: () => void;
};

type SubmissionObjectType = {
  finalSubmit: FinalSubmitType[];
  setFinalSubmit: React.Dispatch<React.SetStateAction<FinalSubmitType[]>>;
  setWebpage: React.Dispatch<React.SetStateAction<webpageType | null>>;
};

interface ImageStyleToolbarProps {
  element: ElementType;
  style?: StyleObject;
  onStyleChange?: (style: StyleObject) => void; // optional callback if needed
  setElement: any;
  imageRef: RefObject<HTMLImageElement | null>;
  onClose: () => void;
  rmElement?: () => void;
  setSrcFn: (fileInfo: any, altText?: any) => void;
  openSelector: Boolean
}

interface hoverEditType { /////// HOVER CONTEXT TYPE
  hoverContext: React.CSSProperties;
  setHoverContext: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
  hoverContextSetter: (css: CSSProperties) => void; // <-- this should be the VALUE type
  setHoverContextSetter: React.Dispatch<React.SetStateAction<(css: CSSProperties) => void>>; // <-- updater matches useState
}

interface screenStyleObjType {
  screenStyles: StyleObject | null,
  setScreenStyle: React.Dispatch<React.SetStateAction<StyleObject | null>>;
}

type MyContextType = {
  contextRef: ContextRefType;
  activeRef: RefType | any;
  contextElement: ContextElementType;
  element: any;
  elementSetter: any;
  rmElementFunc: (id: string) => void;
  width: WidthType;
  activeScreen: screenType;
  widthValue: string;
  toolbarRef: any;
  websiteContent: WebsiteContentType;
  SubmissionObject: SubmissionObjectType;
  finalSubmit: FinalSubmitType[];
  imageContext: ImageStyleToolbarProps | Record<string, any> | null;
  setImageContext: React.Dispatch<React.SetStateAction<ImageStyleToolbarProps | Record<string, any> | null>>;
  imageEdit: Boolean;
  setImageEdit: React.Dispatch<React.SetStateAction<Boolean>>;
  contextForSection: SectionContextType;
  currentSection: React.CSSProperties,
  currentSectionSetter: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
  hoverObject: hoverEditType;
  screenStyleObj: screenStyleObjType;
  sectionChilds: () => any;
  setSectionChildsComponent: React.Dispatch<React.SetStateAction<() => any>>
  sectionChildElements: ElementTypeCustom[];
  setSectionChildElements: React.Dispatch<React.SetStateAction<ElementTypeCustom[]>>;
  sectionChildElementsSetter: (id: string, checked: boolean) => void,
  setSectionChildElementsSetter: React.Dispatch<React.SetStateAction<(id: string, checked: boolean) => void>>;
  sectionChildElementsSetterFull: React.Dispatch<React.SetStateAction<ElementTypeCustom[]>> | null
  setSectionChildElementsSetterFull: React.Dispatch<React.SetStateAction<(React.Dispatch<React.SetStateAction<ElementTypeCustom[]>>) | null>>
  containerRef: HTMLElement | null;
  setContainerRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>
};

const MyFunctionContext = createContext<MyContextType | undefined>(undefined);

function Provider({ children }: { children: ReactNode }) {
  // set the active screen
  const [activeScreen, setActiveScreen] = useState<screenType>("xl");
  const [widthValue, setWidthValue] = useState<string>("")
  // global content
  const [webpage, setWebpage] = useState<webpageType | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null)

  // elements
  const [activeRef, setContextRef] = useState<RefType>(null); // to active the current ref of the element
  const [element, setElement] = useState<any>(null); // to see what element is it right now
  const [elementSetter, setElementSetter] = useState<any>(null);  // to set the setter of the element to work with
  const [rmElementFunc, setRmElementFunc] = useState<() => void>(() => { }); // to set the rm function of the element

  // sections
  const [currentSection, setCurrentSection] = useState<any>(null)
  const [currentSectionSetter, setCurrentSectionSetter] = useState<any>(null)
  const [sectionRef, setSectionRef] = useState<React.RefObject<HTMLElement | null> | null>(null);
  const [sectionGivenNameFn, setSectionGivenName] = useState<stringFunctionType>((id: string) => { });
  const [sectionName, setSectionName] = useState<string>("")
  const [rmSection, setRmSection] = useState<(() => void)>(() => { })
  const [screenStyles, setScreenStyle] = useState<StyleObject | null>(null)
  const [sectionChildElements, setSectionChildElements] = useState<ElementTypeCustom[]>([])
  const [sectionChildElementsSetter, setSectionChildElementsSetter] = useState<(id: string, check: boolean) => void>(() => { })
  const [sectionChildElementsSetterFull, setSectionChildElementsSetterFull] = useState<React.Dispatch<React.SetStateAction<ElementTypeCustom[]>> | null>(null)
  // hover related state
  const [hoverContext, setHoverContext] = useState<React.CSSProperties>({});
  const [hoverContextSetter, setHoverContextSetter] = useState<(css: CSSProperties) => void>((css: CSSProperties) => { });
  const [sectionChildsComponent, setSectionChilds] = useState<() => any>(() => { })

  // images
  const [imageContext, setImageContext] = useState<ImageStyleToolbarProps | Record<string, any> | null>(null)
  const [imageEdit, setImageEdit] = useState<Boolean>(false)

  // final submission
  const [finalSubmit, setFinalSubmit] = useState<FinalSubmitType[]>([]);

  const toolbarRef = useRef<HTMLElement | null>(null);

  const width: WidthType = {
    widthValue,
    setWidthValue,
    activeScreen,
    setActiveScreen
  };

  const contextRef: ContextRefType = { // ref 
    activeRef,
    setContextRef,
    setReference: (ref: RefType) => setContextRef(ref),
    clearReference: () => setContextRef(null)
  };

  const contextForSection: SectionContextType = {
    currentSection,
    setCurrentSection,
    currentSectionSetter,
    setCurrentSectionSetter,
    setRmSection,
    rmSection,
    sectionRef,
    setSectionRef,
    sectionGivenNameFn,
    setSectionGivenName,
    setSectionName,
    sectionName
  }

  const contextElement: ContextElementType = { // element and element setter
    setElementSetter,
    setElement,
    clearElementSetter: () => setElementSetter({}),
    setRmElementFunc
  };

  const screenStyleObj: screenStyleObjType = {
    screenStyles, setScreenStyle
  }

  const hoverObject: hoverEditType = {  //////// HOVER CONTEXT
    hoverContext, setHoverContext,
    hoverContextSetter, setHoverContextSetter
  }

  const websiteContent: WebsiteContentType = { // the whole website
    webpage,
    setWebpage
  };

  const SubmissionObject: SubmissionObjectType = { // handling the submission
    finalSubmit,
    setFinalSubmit,
    setWebpage
  };

  return (
    <MyFunctionContext.Provider
      value={{
        websiteContent, // the base of the elements
        SubmissionObject,
        finalSubmit,
        containerRef,
        setContainerRef,

        width, // context for width
        activeScreen,
        widthValue,

        contextRef, // context for elements and their refs
        activeRef,
        contextElement,
        element,
        elementSetter,
        rmElementFunc,
        screenStyleObj,

        toolbarRef,
        imageContext, // context for the image
        setImageContext,
        imageEdit,
        setImageEdit,

        contextForSection, // context for the section style only
        currentSection,
        currentSectionSetter,

        hoverObject, // hover context
        sectionChilds: sectionChildsComponent,
        setSectionChildsComponent: setSectionChilds,
        sectionChildElements,
        sectionChildElementsSetter,
        setSectionChildElements,
        setSectionChildElementsSetter,
        sectionChildElementsSetterFull,
        setSectionChildElementsSetterFull
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
