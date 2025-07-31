import SearchAndFilter from "./component/SearchAndFilter"
import TableComp from "./component/TableComp"

const Pages = () => {

    return (
        <div>
            <div>
                <div className="mb-5 flex justify-between">
                    <div>
                        <h1 className="text-[30px] text-[#080217] dark:text-zinc-200 font-[600]">Pages Management</h1>
                        <p className="text-[16px] text-[#64748B] dark:text-stone-300 font-[400]">Create, edit, and manage your website pages</p>
                    </div>
                    <button className="theme-gradient text-[14px] px-[24px] py-[12px] rounded-3xl self-center text-[white]">
                        New Page
                    </button>
                </div>
                <SearchAndFilter />
                <TableComp title={"Pages"} />

            </div>
        </div>
    )
}

export default Pages