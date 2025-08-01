import React, { useRef, useState } from "react";
import { useClickOutside } from "../../../app/useClickOutside";

const DeleteUserDialog = ({ open, setOpen, user, onConfirm }) => {
    const [input, setInput] = useState("");

    const dialogRef = useRef(null)

    const handleConfirm = () => {
        if (input === "delete") {
            onConfirm(user?.id);
            setInput("");
            setOpen(false);
        }
    };

    useClickOutside(dialogRef, () => {
        setOpen(false);
        setInput("");
    });

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={dialogRef} className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                <p className="text-sm text-gray-700 mb-4">
                    To confirm deletion of <strong>{user?.name}</strong>, type <code>delete</code> below:
                </p>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type 'delete'"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setInput("");
                            setOpen(false);
                        }}
                        className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={input !== "delete"}
                        className={`px-4 py-2 rounded-md text-white text-sm ${input === "delete"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-red-300 cursor-not-allowed"
                            }`}
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserDialog;
