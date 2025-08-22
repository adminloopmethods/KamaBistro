import React, { useEffect, useState } from "react";
import CustomSelect from "@/app/_common/CustomSelect";
import { getSectionNamesReq } from "@/functionality/fetch";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface AddSectionProps {
  controller: (value: string) => void;
}

const baseClasses = `
  dark:bg-stone-100 select-none
  fixed z-[500] bottom-[2px] right-[10px] rounded-[4px] 
  p-[0px] w-[20%] h-max min-w-[120px] 
  rounded-3xl h-full flex-[1]
`;

const styleClasses = `
  w-full text-left px-3 py-2 
  rounded-md border border-gray-300 
  shadow-sm bg-white flex items-center 
  justify-between focus:outline-none
`;

const sectionsOptions: Option[] = [
  { label: "Section", value: "section" },
  // { label: "Two Section Modal", value: "section-d" },
  // { label: "Three Section Modal", value: "section-t" },
];

const AddSection: React.FC<AddSectionProps> = ({ controller }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [oldSections, setOldSections] = useState<{ id: string, givenName: string }[]>([{ id: "", givenName: "" }])

  const handleChange = (value: string) => {
    setSelectedValue("");
    if (value) controller(value);
  };

  useEffect(() => {
    async function getAllSectionNames() {
      const response = await getSectionNamesReq()

      if (response.ok) {
        console.log(response)
        // setOldSections()
      }
    }

    getAllSectionNames()
  }, [])

  return (
    <CustomSelect
      options={sectionsOptions}
      baseClasses={baseClasses}
      styleClasses={styleClasses}
      onChange={handleChange}
    />
  );
};

export default AddSection;
