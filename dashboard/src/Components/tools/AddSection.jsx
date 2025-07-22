import React, { useState } from "react"; // Import useState


const AddSection = ({ controller }) => {
    // State to manage the selected value of the dropdown
    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (event) => {
        const selectedOptionValue = event.target.value;
        setSelectedValue(""); // Update the state

        if (selectedOptionValue) {
            controller(selectedOptionValue);
        }
    };

    return (
        <select value={selectedValue} onChange={handleChange}
            style={{
                position: "absolute",
                bottom: "0",
                right: "0px",
                border: "none",
                padding: "10px",
                width: "20%",
                minWidth: "120px",
                outline: "none",
                borderRadius: "4px",
                userSelect: "none"
            }}
        >
            <option value="" disabled>Add Element</option> {/* Placeholder/default option */}
            <option value="heading">Single Section Modal</option>
            {/* <option value="paragraph">Two Section Modal</option>
            <option value="paragraph">Three Section Modal</option> */}
        </select>
    )
}

export default AddSection