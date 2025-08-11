// components/Button/CloseButton.tsx
import { X } from "lucide-react";

interface CloseModalButtonProps {
    onClickClose: () => void;
    className?: string;
}

const CloseModalButton: React.FC<CloseModalButtonProps> = ({
    onClickClose,
    className,
}) => {
    return (
        <button
            className={
                className ||
                "absolute z-40 right-4 top-4 bg-transparent hover:bg-stone-300 dark:hover:bg-stone-300 hover:text-stone-900 rounded-full border-none p-2"
            }
            onClick={onClickClose}
        >
            <X className="w-[20px] h-[20px]" />
        </button>
    );
};

export default CloseModalButton;
