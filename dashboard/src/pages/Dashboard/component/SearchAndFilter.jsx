import { useState } from "react";
import SearchC from "../elem-dashboard/Search";
import Select from "../elem-dashboard/Select";

export default function SearchAndFilter() {
    const [searchValue, setSearchValue] = useState("")
    const [selectValue, setSelectValue] = useState("")

    const options = [
        { label: "Inctive", value: "inactive" },
        { label: "Active", value: "active" }
    ]

    const handleSelectChange = (value) => {
        setSelectValue(value)
    }

    const handleSearchChange = (value) => {
        setSearchValue(value)
    }

    return (
        <div className="flex gap-4 bg-white p-8 rounded-3xl">
            <SearchC
                placeholder={"Search User..."}
                onChange={handleSearchChange}
                styleClasses={"bg-stone-200/50 text-sm"}
            />

            <Select
                options={options}
                firstValue={"allUsers"}
                Default="allUsers"
                firstOption={"All Users"}
                onChange={handleSelectChange}
                styleClasses={'bg-stone-200/50 text-sm'}
            />
        </div>
    )
}