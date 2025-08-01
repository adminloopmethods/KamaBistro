import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import InputField from "../elem-dashboard/InputField";
import CustomSelect from "../elem-dashboard/CustomSelect";
import PasswordValidation, { validatePasswordMessage } from "../../../Components/tools/PasswordValidation";
import { checkRegex as validateEmail } from "../../../Components/tools/emailRegex";
import { validateEmpty } from "../../../utils/validator/validateEmptyFields";
import { createUserReq, updateUserReq } from "../../../app/fetch";
import { toastWithUpdate } from "../../../Functionality/toastWithUpdate";
import { useClickOutside } from "../../../app/useClickOutside";

const roles = ["USER", "MANAGER", "ADMIN"];
const baseFormObj = {
    id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    cnfmpassword: "",
    role: "USER"
}

const UserFormDialog = ({ open, onClose, initialData = null, setUserObject, refresh }) => {
    const isEdit = Boolean(initialData);
    const DialogRef = useRef()

    const roleOptions = roles.map((r) => ({ label: r, value: r }));

    const close = () => {
        setUserObject(baseFormObj)
        onClose()
    }

    useClickOutside(DialogRef, close)

    const [formData, setFormData] = useState(baseFormObj);

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id,
                name: initialData.name || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                password: "",
                cnfmpassword: "",
                role: initialData.role || "USER"
            });
        } else {
            setFormData({
                id: "",
                name: "",
                email: "",
                phone: "",
                password: "",
                cnfmpassword: "",
                role: "USER"
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const createUser = async (data) => {
        console.log("User created/updated:", data);

        const reqFn = () => (isEdit ? updateUserReq(initialData.id, data) : createUserReq(data))

        try {
            await toastWithUpdate(
                reqFn,
                {
                    loading: isEdit ? "Updating user..." : "Creating user...",
                    success: () =>
                        isEdit ? "User updated successfully!" : "User created successfully!",
                    error: (err) => err?.message || "Failed to create/update user.",
                }
            );
            refresh();
            close();
        } catch (err) {
            // No need to toast here — toastWithUpdate already handles error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { password, cnfmpassword } = formData;

        if (!validateEmpty(formData, toast)) return;

        if (!validateEmail(formData.email, toast)) return;

        if (!isEdit) {
            if (!password.trim()) return toast.error("Password is required");
            if (!cnfmpassword.trim()) return toast.error("Confirm Password is required");
            if (password !== cnfmpassword) return toast.error("Passwords do not match");

            const passwordError = validatePasswordMessage(password);
            if (passwordError) return toast.error(passwordError);
        }


        await createUser(formData);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-sm">
            <div ref={DialogRef} className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-[50vw] shadow-lg">
                <h2 className="text-3xl font-bold mb-10 font-[300]">
                    {isEdit ? "Update User" : "Add New User"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                        <InputField
                            type="text"
                            name="name"
                            label="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                        />

                        <InputField
                            type="email"
                            name="email"
                            label="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                        />

                        <InputField
                            type="text"
                            name="phone"
                            label="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone"
                        />

                        <div className="col-span-1">
                            <label className="label-text text-stone-800 dark:text-stone-200 mb-1 inline-block">Role</label>
                            <CustomSelect
                                options={roleOptions}
                                Default={formData.role}
                                onChange={(val) => setFormData((prev) => ({ ...prev, role: val }))}
                                firstOption="Select role"
                                firstValue=""
                                disableFirstValue={true}
                                baseClasses={"relative rounded-md flex-[1] h-[5.5vh]"}
                                styleClasses={
                                    "text-sm w-full h-full dark:bg-stone-100 text-left px-3 py-2 rounded-md border border-gray-300 bg-white flex items-center justify-between focus:outline-none"
                                }
                            />
                        </div>

                        <InputField
                            type="password"
                            name="password"
                            label="Password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                        />

                        <InputField
                            type="password"
                            name="cnfmpassword"
                            label="Confirm Password"
                            value={formData.cnfmpassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                        />
                    </div>
            <PasswordValidation new_password={formData.password} />


                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:text-stone-800 dark:hover:text-stone-200 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="theme-gradient px-4 py-2 rounded text-white"
                        >
                            {isEdit ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormDialog;
