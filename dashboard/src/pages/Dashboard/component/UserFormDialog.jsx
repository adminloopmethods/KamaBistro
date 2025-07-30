import React, { useEffect, useState } from "react";
import InputField from "../elem-dashboard/InputField";
import CustomSelect from "../elem-dashboard/Select";

const roles = ["USER", "MANAGER", "ADMIN"];

const UserFormDialog = ({ open, onClose, onSubmit, initialData = null }) => {
    const roleOptions = roles.map((r) => ({ label: r, value: r }));

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "USER"
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                password: "", // do not prefill passwords
                role: initialData.role || "USER"
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                role: "USER"
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    if (!open) return null;

    const isEdit = Boolean(initialData);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-[50vw] shadow-lg">
                <h2 className="text-3xl font-bold mb-10 font-[300]">
                    {isEdit ? "Update User" : "Add New User"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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
                            required
                        />

                        <InputField
                            type="text"
                            name="phone"
                            label="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone"
                            required={false}
                        />

                        <div className="col-span-1">
                            <label className="label-text text-stone-800 mb-1 inline-block">Role</label>
                            <CustomSelect
                                options={roleOptions}
                                Default={formData.role}
                                onChange={(val) => setFormData((prev) => ({ ...prev, role: val }))}
                                firstOption="Select role"
                                firstValue=""
                                disableFirstValue={true}
                                baseClasses={"relative rounded-md flex-[1] "}
                                styleClasses={"w-full text-left px-3 py-2 rounded-md border border-gray-300 rounded-md shadow-sm bg-white flex items-center justify-between focus:outline-none"}
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
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                        />


                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border bg-gray-200 hover:bg-gray-300"
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
