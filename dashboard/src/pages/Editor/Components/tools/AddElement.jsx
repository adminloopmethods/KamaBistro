import { useState } from "react"; // Import useState


const AddElement = ({ controller }) => {
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
                top: "1px",
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
            <option value="heading">Heading</option>
            <option value="paragraph">Paragraph</option>
            {/* <option value="ul">List: Unordered</option>
            <option value="ol">List: Ordered</option> */}
            <option value="image">Image</option>
        </select>
    )
}

export default AddElement