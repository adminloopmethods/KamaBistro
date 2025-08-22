import Heading from "../_component/Elements/Heading";
import ImageElemComponent from "../_component/Elements/ImageElement";
import Paragraph from "../_component/Elements/Paragraph";
import placeHolderImage from "@/assets/placeholderImage.png"
import Division from "../_component/Elements/Division";

// Define screen sizes for style keys
// elements.ts

// Define screen sizes for style keys
type ScreenSize = "xl" | "lg" | "md" | "sm";

// Style object for each screen size
export type StyleObject = Partial<Record<ScreenSize, React.CSSProperties>>;

// Base interface for all elements
export interface BaseElement {
  id: string;
  name: string;
  content: string;
  style: StyleObject;
  [key: string]: any;
}

// Specific element interfaces extending BaseElement

export interface ImageElementType extends BaseElement {
  alt: string;
}

export interface ListElement extends BaseElement {
  items: string[];
}

export interface ButtonElement extends BaseElement {
  onClickAction?: string;
}

export interface LinkElement extends BaseElement {
  href: string;
  target?: string;
}

export interface ParagraphElement extends BaseElement {
  // no extra props needed for now
}

// Default empty styles for all screen sizes
const defaultStyles: StyleObject = {
  xl: {},
  lg: {},
  md: {},
  sm: {},
};

const divisionBaseStyle: React.CSSProperties = {
  "width": "20px",
  "height": "5px",
  "backgroundColor": "transparent",
  "background": "linear-gradient(to right, red, blue)"
}

// Base Element class
class Element implements BaseElement {
  id: string;
  name: string;
  content: string;
  style: StyleObject = defaultStyles;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
    this.id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
  }
}

class DivisionClass extends Element {

  constructor(name: string, content: string) {
    super(name, content)
    this.style = {
      xl: divisionBaseStyle,
      lg: divisionBaseStyle,
      md: divisionBaseStyle,
      sm: divisionBaseStyle
    }
  }
}

// ImageElement class with alt text
class ImageElement extends Element implements ImageElementType {
  alt: string;

  constructor(name: string, content: string, alt: string) {
    super(name, content);
    this.alt = alt;
  }
}

// ListElement class for ul and ol with items array
class ListElementClass extends Element implements ListElement {
  items: string[];

  constructor(name: "ul" | "ol", items: string[] = []) {
    super(name, "");
    this.items = items;
  }
}

// ButtonElement class with optional onClick action
class ButtonElementClass extends Element implements ButtonElement {
  onClickAction?: string;

  constructor(content: string, onClickAction?: string) {
    super("button", content);
    this.onClickAction = onClickAction;
  }
}

// LinkElement class with href and target
class LinkElementClass extends Element implements LinkElement {
  href: string;
  target?: string;

  constructor(content: string, href: string, target?: string) {
    super("a", content);
    this.href = href;
    this.target = target;
  }
}

// Paragraph element class
class ParagraphElementClass extends Element implements ParagraphElement {
  constructor(content: string) {
    super("p", content);
  }
}

// Factory function to generate element data by name
export function generateElementData(
  name: string,
  content: string,
  altOrHrefOrAction?: string,
  extraItems?: string[]
): BaseElement | ImageElementType | ListElement | ButtonElement | LinkElement {
  switch (name) {
    case "img":
      return new ImageElement(name, content, altOrHrefOrAction || "Image");
    case "ul":
    case "ol":
      return new ListElementClass(name as "ul" | "ol", extraItems || []);
    case "button":
      return new ButtonElementClass(content, altOrHrefOrAction);
    case "a":
      return new LinkElementClass(content, altOrHrefOrAction || "#");
    case "p":
      return new ParagraphElementClass(content);
    case "division":
      return new DivisionClass(name, "cotent")
    default:
      return new Element(name, content);
  }
}

// Shortcut alias
const gED = generateElementData;

// CreateElement factory map for default new elements
export const CreateElement: Record<string, () => BaseElement | ImageElementType> = {
  heading: () => gED("h1", "New Heading"),
  paragraph: () => gED("p", "New Paragraph"),
  image: () => gED("img", "", "Placeholder Image"),
  ul: () => gED("ul", "", undefined, ["List item 1", "List item 2"]),
  ol: () => gED("ol", "", undefined, ["First", "Second"]),
  button: () => gED("button", "Click me", "doSomething"),
  link: () => gED("a", "Link text", "https://example.com"),
  line: () => gED("division", "")
};

export default {
  generateElementData,
  CreateElement,
};


// Component map
export const mapElement: Record<string, React.ComponentType<any>> = {
  h1: Heading,
  p: Paragraph,
  img: ImageElemComponent,
  division: Division
};
