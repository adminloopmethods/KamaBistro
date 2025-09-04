import React, { useEffect, useState } from "react";
import CustomSelect from "@/app/_common/CustomSelect";
import { getSectionNamesReq, getSectionReq } from "@/functionality/fetch";
import { useMyContext, webpageType } from "@/Context/EditorContext";
import { toast } from "sonner";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
  onClick?: () => Promise<void>
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
  const [oldSections, setOldSections] = useState<Option[]>([{ value: "", label: "" }])
  const {
    websiteContent, // website object that has {name, id, route, createdAt, updatedAt, content: []} // where content is each section
  } = useMyContext();

  const addSection = (section: Record<string, any>) => {
    websiteContent.setWebpage((prev: webpageType | null) => {
      if (!prev) return null
      return ({
        ...prev,
        contents: [
          ...prev.contents,
          section
        ]
      })
    });
  };

  const onClick = (id: string) => (async () => {
    const response = await getSectionReq(id);

    if (response.ok) {
      toast.success("Section fetched successfully!");

      addSection(response.section)
    } else {
      toast.error("Failed to fetched.")
    }
  })

  const finalOptionsForSection: Option[] = oldSections.map((e: { value: string, label: string }) => {

    return { value: e.value, label: e.label, onClick: onClick(e.value) }
  })

  const handleChange = (value: string) => {
    setSelectedValue("");
    if (value) controller(value);
  };

  useEffect(() => {
    async function getAllSectionNames() {
      const response = await getSectionNamesReq()

      if (response.ok) {
        setOldSections(() => {
          return response.contents.map((e: any, i: number) => {
            const lastThreeChar = String(e.givenName).slice(-3).split("")
            const isDuplicate = lastThreeChar[0] === "(" && typeof (lastThreeChar[1]) === "number" && lastThreeChar[2] === ")"
            const postsuffix = isDuplicate ? `(${lastThreeChar[1] + 1})` : "(1)"
            const givenName: string = e.givenName ? `${e.givenName} duplicate${postsuffix}` : ("random" + (i + 1))
            return {
              value: e.id, label: givenName
            }
          })
        })
      }
    }

    getAllSectionNames()
  }, [])

  return (
    <CustomSelect
      options={[...sectionsOptions, ...finalOptionsForSection]}
      baseClasses={baseClasses}
      styleClasses={styleClasses}
      onChange={handleChange}
    />
  );
};

export default AddSection;
