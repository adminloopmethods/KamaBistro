// src/Context/ContextApi.jsx
import { createContext, useContext, useRef, useState } from 'react';

const MyFunctionContext = createContext();

function Provider({ children }) {
    const [activeRef, setContextRef] = useState(null);
    const [elementSetter, setElementSetter] = useState(null);
    const [element, setElement] = useState(null)
    const [currentWidth, setWidth] = useState("")
    const [rmElementFunc, setRmElementFunc] = useState(() => { })
    const [content, setContent] = useState([]) // store all content over the page
    const [finalSubmit, setFinalSubmit] = useState([]) // [{id:"", submit: () => {}}]

    const toolbarRef = useRef(null)

    const width = {
        currentWidth,
        setWidth
    };

    const contextRef = {
        activeRef,
        setContextRef,
        setReference: (ref) => setContextRef(ref),
        clearReference: () => setContextRef(null),
    };

    const contextElement = {
        setElementSetter,
        setElement,
        clearElementSetter: () => setElementSetter({}),
        setRmElementFunc,
    };

    const websiteContent = {
        content, setContent
    }

    const SubmissionObject = {
        finalSubmit,
        setFinalSubmit,
        setContent
    };

    return (
        <MyFunctionContext.Provider value={{
            contextRef, // activeRef object
            activeRef, // the actual activeRef
            contextElement, // the active element
            element, // the actual element to setup
            rmElementFunc,
            elementSetter, // the set the setter to make any changes
            width, // width object of the screen
            currentWidth, // width of the screen
            toolbarRef, // reference for toolbar 
            websiteContent, // content for website
            SubmissionObject,
            finalSubmit
        }}>
            {children}
        </MyFunctionContext.Provider>
    );
}

function useMyContext() {
    return useContext(MyFunctionContext);
}

export { Provider, useMyContext };
