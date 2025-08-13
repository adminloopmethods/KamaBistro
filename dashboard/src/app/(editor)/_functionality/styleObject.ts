type Style = Record<string, any>;
type ElementType = {
    style: Record<string, Style>;
    [key: string]: any;
};
type SetterType = (fn: (prev: any) => any) => void;

// BOLD
export const onBold = (
    element: ElementType,
    Setter: SetterType,
    currentWidth: string
) => {
    console.log(element)
    console.log(currentWidth)
    const currentStyle = { ...element.style[currentWidth] };
    const boldness = currentStyle.fontWeight;
    if (boldness === "bold" || boldness < 600) {
        currentStyle.fontWeight = "lighter";
        Setter((prev: any) => ({
            ...prev,
            style: { ...prev.style, [currentWidth]: currentStyle }
        }));
    } else {
        currentStyle.fontWeight = "bold";
        Setter((prev: any) => ({
            ...prev,
            style: { ...prev.style, [currentWidth]: currentStyle }
        }));
    }
};

// ITALIC
export const onItalic = (
    element: ElementType,
    Setter: SetterType,
    currentWidth: string
) => {
    const currentStyle = { ...element.style[currentWidth] };
    const styleness = currentStyle.fontStyle;
    if (styleness === "italic") {
        currentStyle.fontStyle = "normal";
        Setter((prev: any) => ({
            ...prev,
            style: { ...prev.style, [currentWidth]: currentStyle }
        }));
    } else {
        currentStyle.fontStyle = "italic";
        Setter((prev: any) => ({
            ...prev,
            style: { ...prev.style, [currentWidth]: currentStyle }
        }));
    }
};

// UNDERLINE
export const onUnderline = (
    element: ElementType,
    Setter: SetterType,
    currentWidth: string
) => {
    const currentStyle = { ...element.style[currentWidth] };
    const isUnderline = currentStyle.textDecoration;
    if (isUnderline === "underline") {
        currentStyle.textDecoration = "none";
        Setter((prev: any) => ({
            ...prev,
            style: { ...prev.style, [currentWidth]: currentStyle }
        }));
    } else {
        currentStyle.textDecoration = "underline";
        Setter((prev: any) => ({
            ...prev,
            style: { ...prev.style, [currentWidth]: currentStyle }
        }));
    }
};

// FONT SIZE
export const onSizeChange = (
    size: string,
    element: ElementType,
    Setter: SetterType,
    currentWidth: string
) => {
    const currentStyle = { ...element.style[currentWidth] };
    currentStyle.fontSize = size;
    Setter((prev: any) => ({
        ...prev,
        style: { ...prev.style, [currentWidth]: currentStyle }
    }));
};

// FONT FAMILY
export const onFamilyFontChange = (
    family: string,
    element: ElementType,
    Setter: SetterType,
    currentWidth: string
) => {
    const currentStyle = { ...element.style[currentWidth] };
    currentStyle.fontFamily = family;
    Setter((prev: any) => ({
        ...prev,
        style: { ...prev.style, [currentWidth]: currentStyle }
    }));
};

// TEXT COLOR
export const onColorChange = (
    value: string,
    element: ElementType,
    Setter: SetterType,
    currentWidth: string
) => {
    const currentStyle = { ...element.style[currentWidth] };
    currentStyle.color = value;
    Setter((prev: any) => ({
        ...prev,
        style: { ...prev.style, [currentWidth]: currentStyle }
    }));
};

// TEXT ALIGN
export const onAlignChange = (
    alignment: string,
    element: ElementType,
    Setter: SetterType,
    currentWidth: string
) => {
    const currentStyle = { ...element.style[currentWidth] };
    currentStyle.textAlign = alignment;
    Setter((prev: any) => ({
        ...prev,
        style: { ...prev.style, [currentWidth]: currentStyle }
    }));
};