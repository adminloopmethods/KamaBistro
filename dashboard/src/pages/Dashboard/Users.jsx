const Users = () => {

    return (
        <div>
            <div className="mb-5 flex justify-between">
                <div>
                    <h1 className="text-[30px] text-[#080217] dark:text-zinc-200 font-[600]">Users Management</h1>
                    <p className="text-[16px] text-[#64748B] dark:text-stone-300 font-[400]">Manage user accounts and permissions</p>
                </div>
                <button className="theme-gradient text-[14px] px-[24px] py-[12px] rounded-[12px] self-center">
                    Add User
                </button>
            </div>

        </div>
    )
}

export default Users