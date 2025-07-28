import { TrendingDown, TrendingUp } from "lucide-react"

const OverviewCard = ({ title, numbers, isPositive = true, percentage, Icon }) => {
    const color = isPositive ? "#60a5fa" : "#ef4444";
    return (
        <div className="p-[24px] flex justify-between items-center bg-white rounded-[1.25rem] flex-1">
            <div className="flex flex-col">
                <h3 className="text-[14px] text-[#64748B] ">{title}</h3>
                <p className="text-[30px] text-[#080217] ">{numbers}</p>
                <p className={`text-[14px]`} style={{ color }}>
                    <span className="flex items-center gap-[4px]">{isPositive ? <TrendingUp className="w-[15px]" /> : <TrendingDown className="w-[15px]" />} <span>{isPositive ? "+" : "-"}{percentage}</span></span>
                </p>
            </div>
            <div className="w-[48px] aspect-[1/1] border flex items-center justify-center rounded-[12px] overflow-hidden"
                style={{
                    backgroundImage: "linear-gradient(135deg, #637fe3 0%, #8556c2 100%)",
                    WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                    backgroundClip: "padding-box" 
                }}
            >
                {<Icon className={"w-[24px] h-[24px]"} />}
            </div>
        </div>
    )
}

export default OverviewCard