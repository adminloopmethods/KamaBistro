import React, { useState } from "react";
import CustomSelect from "@/app/_common/CustomSelect";

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
  absolute bottom-[2px] right-0 rounded-[4px] 
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
  { label: "Single Section Modal", value: "section" },
  // { label: "Two Section Modal", value: "section-d" },
  // { label: "Three Section Modal", value: "section-t" },
];

const AddSection: React.FC<AddSectionProps> = ({ controller }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleChange = (value: string) => {
    setSelectedValue("");
    if (value) controller(value);
  };

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
