import Section from "../_component/Elements/Section";

export type StyleObject = Record<string, string>;

export interface ResponsiveStyles {
    xl: StyleObject;
    lg: StyleObject;
    md: StyleObject;
    sm: StyleObject;
}

export interface SectionElementType {
    name: string;
    elements: any[];
    style: ResponsiveStyles;
    id: string;
    givenName: string;
    hover: ResponsiveStyles;
}

const baseStyle: StyleObject = {
    width: "100%",
    minWidth: "2px",
    minHeight: "1vh",
    height: "auto",
    paddingTop: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
    paddingLeft: "20px",
    marginLeft: "0",
    marginRight: "0",
    marginTop: "0",
    marginBottom: "0",
    position: "relative",
    top: "0",
    left: "0",
    overflow: "hidden",
};

const styles: ResponsiveStyles = {
    xl: baseStyle,
    lg: baseStyle,
    md: baseStyle,
    sm: baseStyle,
};

class SectionElement implements SectionElementType {
    name: string = "";
    elements: any[] = [];
    style: ResponsiveStyles = styles;
    id: string =
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString();

    constructor(name: string) {
        this.name = name;
    }
    givenName: string = "";
    hover: ResponsiveStyles = {
        xl: {}, lg: {}, md: {}, sm: {}
    }
}

function generateElementData(name: string): SectionElement {
    return new SectionElement(name);
}

const gED = generateElementData;

export const CreateSection: Record<string, () => SectionElement> = {
    section: () => gED("section"),
};

export const mapSection: Record<string, React.ComponentType<any>> = {
    section: Section,
};
