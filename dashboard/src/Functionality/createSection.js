import Section from "../Components/Editor/elements/Section.jsx";

const baseStyle = {
    width: '100%',
    minHeight: '20vh',
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    position: "relative",
    top: 0, // 👈 required for absolute dragging
    left: 0,
    overflow: "hidden"
}

const styles = {
    "xl": baseStyle,
    "lg": {},
    "md": {},
    "sm": {}
}

class SectionElement {
    name = "";
    elements = [];
    style = styles;
    id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    constructor(name) {
        this.name = name;
    }
}

function generateElementData(name) {
    return new SectionElement(name)
}

const gED = generateElementData;

export const CreateSection = {
    "section": () => gED("section"),
}

export const mapSection = {
    "section": Section
}