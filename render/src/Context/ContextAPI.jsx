// src/Context/ContextApi.jsx
import { createContext, useContext, useRef, useState } from 'react';

const MyFunctionContext = createContext();

function Provider({ children }) {
    const [element, setElement] = useState(null)
    const [currentWidth, setWidth] = useState("")
    const [content, setContent] = useState([]) // store all content over the page


    const width = {
        currentWidth,
        setWidth
    }



    const contextElement = {
        setElement,
    };

    const websiteContent = {
        content, setContent
    }

    return (
        <MyFunctionContext.Provider value={{
            contextElement, // the active element
            element, // the actual element to setup
            width, // width object of the screen
            currentWidth, // width of the screen
            websiteContent, // content for website
        }}>
            {children}
        </MyFunctionContext.Provider>
    );
}

function useMyContext() {
    return useContext(MyFunctionContext);
}

export { Provider, useMyContext };
