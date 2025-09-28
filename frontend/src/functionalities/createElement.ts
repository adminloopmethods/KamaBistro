import Heading from "@/app/_elements/Heading";
import Paragraph from "@/app/_elements/Paragraph";
import ImageElemComponent from "@/app/_elements/ImageComponentElement";
import Division from "@/app/_elements/Division";
import HeadingTwo from "@/app/_elements/HeadingTwo";
import HeadingThree from "@/app/_elements/HeadingThree";
import Anchor from "@/app/_elements/Anchor";
import ContactForm from "@/app/_elements/ContactForm";
import BookTableWicker from "@/app/_elements/BookTable";
import HotelTimings from "@/app/_elements/RestaurantTimings";
import SingleLocationMap from "@/app/_elements/MappSimple";
import BookTableLaGrange from "@/app/_elements/BookTableLaGrange";
import MenuTabs from "@/app/_elements/Menu";

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
    aria: string;
}

// Component map
export const mapElement: Record<string, React.ComponentType<any>> = {
    h1: Heading,
    h2: HeadingTwo,
    h3: HeadingThree,
    a: Anchor,
    p: Paragraph,
    img: ImageElemComponent,
    division: Division,
    contact: ContactForm,
    bookTable: BookTableWicker,
    bookTableLa: BookTableLaGrange,
    map: SingleLocationMap,
    menu: MenuTabs
};
