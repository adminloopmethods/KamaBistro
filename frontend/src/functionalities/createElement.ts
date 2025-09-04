import Heading from "@/app/_elements/Heading";
import Paragraph from "@/app/_elements/Paragraph";
import ImageElemComponent from "@/app/_elements/ImageComponentElement";
import Division from "@/app/_elements/Division";
import HeadingTwo from "@/app/_elements/HeadingTwo";
import HeadingThree from "@/app/_elements/HeadingThree";
import Anchor from "@/app/_elements/Anchor";

// Define screen sizes for style keys
type ScreenSize = "xl" | "lg" | "md" | "sm";

// Style object for each screen size
type StyleObject = Partial<Record<ScreenSize, React.CSSProperties>>;

// Base interface for all elements
export interface BaseElement {
    id: string;
    name: string;
    content: string;
    style: StyleObject;
    [key: string]: any;
    hover: StyleObject;
    ariaLabel: string;
}

/**
 *   id: string;
  name: string;
  content: string;
  style: StyleObject;
  [key: string]: any;
  hover: StyleObject;
  ariaLabel: string;
 */

// Image element extends base and adds `alt`
// export interface ImageElementType extends BaseElement {
//     alt: string;
// }

// // Default empty styles
// const defaultStyles: StyleObject = {
//     xl: {},
//     lg: {},
//     md: {},
//     sm: {},
// };

// // Base Element class
// class Element implements BaseElement {
//     id: string;
//     name: string;
//     content: string;
//     style: StyleObject = defaultStyles;

//     constructor(name: string, content: string) {
//         this.name = name;
//         this.content = content;
//         this.id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
//     }
// }

// // ImageElement class with `alt`
// class ImageElement extends Element implements ImageElementType {
//     alt: string;

//     constructor(name: string, content: string, alt: string) {
//         super(name, content);
//         this.alt = alt;
//     }
// }

// // Factory function
// function generateElementData(name: string, content: string, alt?: string): BaseElement | ImageElementType {
//     if (name === "img") {
//         return new ImageElement(name, content, alt || "Image");
//     }
//     return new Element(name, content);
// }

// const gED = generateElementData;

// // CreateElement factory map
// export const CreateElement: Record<string, () => BaseElement | ImageElementType> = {
//     heading: () => gED("h1", "New Heading"),
//     paragraph: () => gED("p", "New Paragraph"),
//     image: () => gED("img", "", "Placeholder Image"),
// };

// Component map
export const mapElement: Record<string, React.ComponentType<any>> = {
    h1: Heading,
    h2: HeadingTwo,
    h3: HeadingThree,
    a: Anchor,
    p: Paragraph,
    img: ImageElemComponent,
    division: Division
};
