import OverviewCard from "./component/Overviewcards"
import { Eye, Users, FileText } from "lucide-react"

const Overview = () => {

    return (
        <div>
            <div className="mb-5">
                <h1 className="text-[30px] text-[#080217] dark:text-zinc-200 font-[600]">Dashboard Overview</h1>
                <p className="text-[16px] text-[#64748B] dark:text-stone-300 font-[400]">Welcome back, manage your content and users</p>
            </div>
            <div className="flex gap-[1.5rem]">
                <OverviewCard title={"Total Pages"} numbers={"0"} percentage={"12"} Icon={FileText} isPositive={false} />
                <OverviewCard title={"Total Users"} numbers={"0"} percentage={"12"} Icon={Users} />
                <OverviewCard title={"Page Views"} numbers={"0"} percentage={"24"} Icon={Eye} />
            </div>
        </div>
    )
}

export default Overview