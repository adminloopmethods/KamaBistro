import { useState } from "react"; // Import useState
import CustomSelect from "../../Dashboard/elem-dashboard/CustomSelect";


const AddElement = ({ controller }) => {
    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (value) => {
        const selectedOptionValue = value;
        setSelectedValue(""); // Update the state

        if (selectedOptionValue) {
            controller(selectedOptionValue);
        }
    };

    const elementTypeOptions = [
        { label: 'Add Element', value: '', disabled: true },
        { label: 'Heading', value: 'heading' },
        { label: 'Paragraph', value: 'paragraph' },
        // { label: 'List: Unordered', value: 'ul' },
        // { label: 'List: Ordered', value: 'ol' },
        { label: 'Image', value: 'image' },
    ];



    return (
        <CustomSelect
            options={elementTypeOptions}
            onChange={handleChange}
            firstOption="Add Element"
            disableFirstValue={true}
            baseClasses={baseClasses}
        />
    )
}

const baseClasses = `dark:bg-stone-100 z-[3] 
rounded-3xl h-full flex-[1] absolute 
max-w-[340px] w-fit top-[1px] right-0 select-none`

export default AddElement