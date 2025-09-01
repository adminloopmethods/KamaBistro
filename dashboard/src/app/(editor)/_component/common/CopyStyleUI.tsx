import { screenType } from "@/Context/EditorContext"

type Props = {
    copyTheStyle: (screen: screenType) => void
}

const CopyStylesUI: React.FC<Props> = ({ copyTheStyle }) => {

    return (
        <div>
            <label htmlFor="" className="text-xs mt-2 font-bold border-t pt-2"> Copy Style from</label>
            <div className="flex gap-2">
                <button className='cursor-pointer border p-2 rounded-md w-[40px] font-bold' onClick={() => { copyTheStyle("xl") }}>
                    XL
                </button>

                <button className='cursor-pointer border p-2 rounded-md w-[40px] font-bold' onClick={() => { copyTheStyle("lg") }}>
                    LG
                </button>
                <button className='cursor-pointer border p-2 rounded-md w-[40px] font-bold' onClick={() => { copyTheStyle("md") }}>
                    MD
                </button>
                <button className='cursor-pointer border p-2 rounded-md w-[40px] font-bold' onClick={() => { copyTheStyle("sm") }}>
                    SM
                </button>
            </div>
        </div>
    )
}

export default CopyStylesUI