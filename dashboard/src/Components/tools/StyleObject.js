// BOLD
export const onBold = (element, Setter, currentWidth) => {
    const currentStyle = { ...element.style[currentWidth] }
    const boldness = currentStyle.fontWeight
    if (boldness === "bold" || boldness < 600) {
        currentStyle.fontWeight = "lighter"
        Setter(prev => {
            return { ...prev, style: { ...prev.style, [currentWidth]: currentStyle } }
        })
    } else {
        currentStyle.fontWeight = "bold"
        Setter(prev => {
            return { ...prev, style: { ...prev.style, [currentWidth]: currentStyle } }
        })
    }
}

// ITALIC
export const onItalic = (element, Setter, currentWidth) => {
    const currentStyle = { ...element.style[currentWidth] }
    const styleness = currentStyle.fontStyle
    if (styleness === "italic") {
        currentStyle.fontStyle = "normal"
        Setter(prev => {
            return { ...prev, style: { ...prev.style, [currentWidth]: currentStyle } }
        })
    } else {
        currentStyle.fontStyle = "italic"
        Setter(prev => {
            return { ...prev, style: { ...prev.style, [currentWidth]: currentStyle } }
        })
    }
}

// UNDERLINE
export const onUnderline = (element, Setter, currentWidth) => {
    const currentStyle = { ...element.style[currentWidth] }
    const isUnderline = currentStyle.textDecoration
    if (isUnderline === "underline") {
        currentStyle.textDecoration = "none"
        Setter(prev => {
            return { ...prev, style: { ...prev.style, [currentWidth]: currentStyle } }
        })
    } else {
        currentStyle.textDecoration = "underline"
        Setter(prev => {
            return { ...prev, style: { ...prev.style, [currentWidth]: currentStyle } }
        })
    }
}

// FONT SIZE
export const onSizeChange = (size, element, Setter, currentWidth) => {
    const currentStyle = { ...element.style[currentWidth] }
    currentStyle.fontSize = size
    Setter(prev => {
        return { ...prev, style: { ...prev.style, [currentWidth]: currentStyle } }
    })
}

// FONT FAMILY
export const onFamilyFontChange = (family, element, Setter, currentWidth) => {
    const currentStyle = { ...element.style[currentWidth] }
    currentStyle.fontFamily = family
    Setter(prev => {
        return { ...prev, style: { ...prev.style, [currentWidth]: currentStyle } }
    })
}
// TEXT COLOR
export const onColorChange = (value, element, Setter, currentWidth) => {
    const currentStyle = { ...element.style[currentWidth] }
    currentStyle.color = value
    Setter(prev => {
        return { ...prev, style: { ...prev.style, [currentWidth]: currentStyle } }
    })
}
// TEXT ALIGN
export const onAlignChange = (alignment, element, Setter, currentWidth) => {
    const currentStyle = { ...element.style[currentWidth] };
    currentStyle.textAlign = alignment;

    Setter(prev => ({
        ...prev,
        style: {
            ...prev.style,
            [currentWidth]: currentStyle,
        },
    }));
};
