import React, { useState } from "react"; // Import useState
import CustomSelect from "../../../Dashboard/elem-dashboard/CustomSelect";


const AddSection = ({ controller }) => {
    // State to manage the selected value of the dropdown
    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (value) => {
        const selectedOptionValue = value;
        setSelectedValue(""); // Update the state

        if (selectedOptionValue) {
            controller(selectedOptionValue);
        }
    };

    return (
        <CustomSelect
            options={sectionsOptions}
            baseClasses={baseClasses}
            onChange={handleChange}
            styleClasses={styleClasses}
        />
    )
}

const baseClasses =
    `dark:bg-stone-100 select-none
absolute bottom-[2px] right-0 rounded-[4px] 
p-[0px] w-[20%] h-max min-w-[120px] 
rounded-3xl h-full flex-[1]
`

const styleClasses =
    `w-full text-left px-3 py-2 
    rounded-md border border-gray-300 
    shadow-sm bg-white flex items-center 
    justify-between focus:outline-none
    `

const sectionsOptions = [
    { label: "Single Section Modal", value: "section" },
    // {label: "Two Section Modal", value: "section-d"},
    // {label: "Three Section Modal", value: "section-t"}
]

export default AddSection