import CustomSelect from "@/app/_common/CustomSelect";
import { useState } from "react";

interface AddElementProps {
    controller: (value: string) => void;
}

interface Option {
    label: string;
    value: string;
    disabled?: boolean;
}

const baseClasses = `dark:bg-stone-100 z-[3] 
rounded-[4px] h-full flex-[1] absolute 
max-w-[340px] w-fit top-[1px] right-0 select-none`;

const styleClasses = `
  w-full text-left px-3 py-2 
  rounded-md border border-gray-300 
  shadow-sm bg-white flex items-center 
  justify-between focus:outline-none
`;

const AddElement: React.FC<AddElementProps> = ({ controller }) => {
    const [selectedValue, setSelectedValue] = useState<string>("");

    const handleChange = (value: string) => {
        const selectedOptionValue = value;
        setSelectedValue("");

        if (selectedOptionValue) {
            controller(selectedOptionValue);
        }
    };

    const elementTypeOptions: Option[] = [
        { label: "Add Element", value: "", disabled: true },
        { label: "Heading", value: "heading" },
        { label: "Paragraph", value: "paragraph" },
        { label: "Image", value: "image" },
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
