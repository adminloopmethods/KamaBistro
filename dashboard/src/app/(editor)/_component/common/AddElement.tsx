import CustomSelect from "@/app/_common/CustomSelect";
import { useState } from "react";

interface AddElementProps {
    controller: (value: string) => void;
    canAddSection?: Boolean
}

interface Option {
    label: string;
    value: string;
    disabled?: boolean;
}

const baseClasses = `dark:bg-stone-100 z-[3]
rounded-[4px] h-[fit] flex-[1] absolute right-0 
max-w-[340px] min-w-[200px] top-[1px] select-none`;

const styleClasses = `
  w-full text-left px-3 py-2 
  rounded-md border border-gray-300 
  shadow-sm bg-white flex items-center 
  justify-between focus:outline-none
`;

const AddElement: React.FC<AddElementProps> = ({ controller, canAddSection }) => {
    const [selectedValue, setSelectedValue] = useState<string>("");

    const handleChange = (value: string) => {
        const selectedOptionValue = value;
        setSelectedValue("");

        if (selectedOptionValue) {
            controller(selectedOptionValue);
        }
    };

    const elementTypeOptions: Option[] = [
        ...(canAddSection ? [{ label: "Section", value: "section" }] : []),
        { label: "Heading", value: "heading" },
        { label: "Paragraph", value: "paragraph" },
        { label: "Image", value: "image" },
        // { label: "Image", value: "image" },
        // { label: "Image", value: "image" },
    ];

    return (
        <CustomSelect
            options={elementTypeOptions}
            onChange={handleChange}
            firstOption="Add Element"
            disableFirstValue={true}
            baseClasses={baseClasses}
            styleClasses={styleClasses}
        />
    );
};

export default AddElement;
