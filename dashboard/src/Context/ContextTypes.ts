import { StyleObject } from "@/app/(editor)/_functionality/createElement";
import { ElementType, RefObject } from "react";

export type RefType = HTMLElement | null;

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

export type ContextRefType = {
    activeRef: RefType;
    setContextRef: React.Dispatch<React.SetStateAction<RefType>>;
    setReference: (ref: RefType) => void;
    clearReference: () => void;
};


export type WebsiteContentType = {
    webpage: webpageType | null;
    setWebpage: React.Dispatch<React.SetStateAction<webpageType | null>>;
};

export interface SectionContextType {
    currentSection: React.CSSProperties,
    setCurrentSection: React.Dispatch<React.SetStateAction<React.CSSProperties>>,
    currentSectionSetter: React.Dispatch<React.SetStateAction<React.CSSProperties>>,
    setCurrentSectionSetter: React.Dispatch<React.SetStateAction<() => void>>,
    rmSection: () => void,
    setRmSection: React.Dispatch<React.SetStateAction<() => void>>,
    sectionRef: React.RefObject<HTMLElement | null> | null,
    setSectionRef: React.Dispatch<React.SetStateAction<React.RefObject<HTMLElement | null> | null>>
    sectionGivenNameFn: (value: string) => void,
    setSectionGivenName: React.Dispatch<React.SetStateAction<(value: string) => void>>
}


export type ContextElementType = {
    setElementSetter: React.Dispatch<React.SetStateAction<any>>;
    setElement: React.Dispatch<React.SetStateAction<any>>;
    clearElementSetter: () => void;
    setRmElementFunc: React.Dispatch<React.SetStateAction<() => void>>;
};

export type WidthType = {
    widthValue: string;
    setWidthValue: React.Dispatch<React.SetStateAction<string>>;
    activeScreen: string;
    setActiveScreen: React.Dispatch<React.SetStateAction<screenType>>;
};

export type FinalSubmitType = {
    id: string;
    submit: () => void;
};

export type SubmissionObjectType = {
    finalSubmit: FinalSubmitType[];
    setFinalSubmit: React.Dispatch<React.SetStateAction<FinalSubmitType[]>>;
    setWebpage: React.Dispatch<React.SetStateAction<webpageType | null>>;
};

export interface ImageStyleToolbarProps {
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

export interface hoverEditType { /////// HOVER CONTEXT TYPE
    hoverContext: string;
    setHoverContext: React.Dispatch<React.SetStateAction<string>>;
    hoverContextSetter: (() => void) | null; // <-- this should be the VALUE type
    setHoverContextSetter: React.Dispatch<React.SetStateAction<(() => void) | null>>; // <-- updater matches useState
}

export type MyContextType = {
    contextRef: ContextRefType;
    activeRef: RefType | any;
    contextElement: ContextElementType;
    element: any;
    elementSetter: any;
    rmElementFunc: (id: string) => void;
    width: WidthType;
    activeScreen: string;
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
    currentSectionSetter: React.Dispatch<React.SetStateAction<React.CSSProperties>> | null;
    hover: hoverEditType
};


export type stringFunctionType = (value: string) => void 