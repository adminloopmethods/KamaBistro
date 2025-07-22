import AddElement from "../tools/AddElement";
import { mapElement, CreateElement } from "../../Functionality/createElement";
import { useEffect, useRef, useState } from "react";
import DimensionToolbar from "../tools/DimensionToolbar";
import { useMyContext } from "../../Context/ContextApi";
import StyleToolbar from "../tools/StyleToolbar";

const Section = ({ element, rmSection, onEditing, style, updateData, setUpdateData, lastSection, section }) => {
    const [openToolBar, setOpenToolBar] = useState(false);
    const [onAddElement, setOnAddElement] = useState(false)
    const [elements, setElements] = useState(element);
    const { contextRef, currentWidth, contextElement, websiteContent, SubmissionObject } = useMyContext();
    const sectionRef = useRef(null)
    const [sectionStyle, setSectionStyle] = useState(style)
    const [allowUpdate, setAllowUpdate] = useState(true)

    // if (updateData && allowUpdate) {
    //     websiteContent.setContent(prev => {
    //         return prev.map((e) => {
    //             if (e.id === element.id) {
    //                 return { ...e, elements: elements, style: { ...style, [currentWidth]: sectionStyle } }
    //             } else {
    //                 return e
    //             }
    //         })
    //     })

    //     setAllowUpdate(false)

    //     if (lastSection) {
    //         setUpdateData(false)
    //     }
    // }

    // console.log(sectionStyle)

    const [isDragging, setIsDragging] = useState(false);
    const [dragOffsetX, setDragOffsetX] = useState(0);
    const [dragOffsetY, setDragOffsetY] = useState(0);


    const handleMouseDown = (e) => {
        if (sectionStyle.position !== 'absolute') return;

        const rect = sectionRef.current.getBoundingClientRect();
        setDragOffsetX(e.clientX - rect.left);
        setDragOffsetY(e.clientY - rect.top);
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        console.log(e)
        const rect = sectionRef.current.getBoundingClientRect();
        console.log(rect)


        const newLeft = (e.clientX - dragOffsetX);
        const newTop = (e.clientY - dragOffsetY);

        console.log(newLeft, newTop)
        setSectionStyle(prev => ({
            ...prev,
            left: newLeft,
            top: newTop
        }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const onEdit = () => {
        onEditing()
        contextElement.setElementSetter(() => () => setSectionStyle)
        if (!onAddElement) {
            sectionRef.current.style.border = "1px solid black"
        } else {
            sectionRef.current.style.border = ""
            setOnAddElement(false)
            return
        }
        setOnAddElement(!onAddElement)
    }

    const addElement = (elementToAdd) => { // Add a new element to the section
        const element = CreateElement[elementToAdd]();
        setElements(prev => [...prev, element]);
        setOpenToolBar(false)
    };

    const rmElement = (elementID) => { // remove an existing element
        setElements(prev => {
            const newSet = prev.filter((element, i) => {
                return element.id !== elementID
            })
            return newSet
        })
    }

    const updateTheDataOfElement = (id, property, value) => { // update the text/content of the element
        console.log("updating object", property, value)
        setElements(prev =>
            prev.map(e =>
                e.id === id ? { ...e, [property]: value } : e
            )
        );
    };

    const updateElement = (id, value) => {
        setElements(prev =>
            prev.map(e =>
                e.id === id ? { ...value } : e
            )
        );
    }

    // const updateSectionStyles = (newStyles) => { // update the styles of the section
    //     // console.log(newStyles)
    //     setSectionStyle(prev => ({
    //         ...prev,
    //         ...newStyles
    //     }));
    // };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    console.log(sectionStyle)


    useEffect(() => {
        function saveToGlobalObject() {
            SubmissionObject.setContent(prev => { // [{id: "", elements: [], style: { xl:{},lg:{},md:{},sm:{} }, name: "". }]
                // console.log(sectionStyle)
                return prev.map((e) => {
                    console.log(e.id)
                    console.log(elements)
                    console.log(sectionStyle)
                    if (e.id === section.id) {
                        return { ...e, elements: elements, style: { ...e.style, [currentWidth]: sectionStyle } }
                    } else {
                        return e
                    }
                })
            })
        }
        SubmissionObject.setFinalSubmit(prev => {
            const removedSame = prev.filter((e) => e.id !== section.id)
            return [...removedSame, { id: section.id, submit: saveToGlobalObject }]
        })
    }, [elements, sectionStyle, currentWidth])

    return (
        <>
            <section
                ref={sectionRef}
                style={sectionStyle}
                onDoubleClick={onEdit}
                onMouseDown={handleMouseDown}
            >
                {elements.map((Element, i) => {
                    const Component = mapElement[Element.name];
                    return (
                        <Component
                            key={i}
                            element={Element}
                            updateContent={updateTheDataOfElement}
                            updateElement={updateElement}
                            style={Element.style?.[currentWidth]}
                            currentWidth={currentWidth}
                            rmElement={rmElement}
                        />
                    );
                })}

                {onAddElement && <AddElement controller={addElement} />}
            </section>



        </>
    );
};

export default Section;
