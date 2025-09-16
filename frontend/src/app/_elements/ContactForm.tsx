"use client";

import { useState, ChangeEvent, FormEvent, ReactNode } from "react";
import { toast } from "sonner";
import inputCss from "./input.module.css"
import { sendMessageReq } from "@/functionalities/fetch";

interface FormData {
    name: string;
    email: string;
    message: string;
}

interface FormGroupProps {
    label: string;
    htmlFor: string;
    required?: boolean;
    children: ReactNode;
}

const FormGroup = ({ label, htmlFor, required = false, children }: FormGroupProps) => (
    <div className="mb-4 flex flex-col">
        <label htmlFor={htmlFor} className="mb-1 font-[300]">
            {label} {required && <span aria-hidden="true">*</span>}
        </label>
        {children}
    </div>
);

export default function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await sendMessageReq(formData);

            if (res.success) {
                toast.success("Message sent successfully!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                toast.error(res.error || "Failed to send message.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-[95%] sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto p-6 sm:p-8 shadow-lg rounded-md border border-stone-500/25 bg-[#F4ECE3] relative z-[30]"
            aria-label="Contact Form"
        >
            {/* Name */}
            <FormGroup label="Full Name" htmlFor="messengerName" required>
                <input
                    id="messengerName"
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-white/40 border border-[#AE906080] ${inputCss.placeholderCustom} h-[45px] sm:h-[50px] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    required
                    aria-required="true"
                    title="Enter your full name"
                />
            </FormGroup>

            {/* Email */}
            <FormGroup label="Email" htmlFor="messengerEmail" required>
                <input
                    id="messengerEmail"
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-white/40 border border-[#AE906080] ${inputCss.placeholderCustom} h-[45px] sm:h-[50px] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    required
                    aria-required="true"
                    title="Enter your email address"
                />
            </FormGroup>

            {/* Message */}
            <FormGroup label="How can we help you?" htmlFor="messengersMessage" required>
                <textarea
                    id="messengersMessage"
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full bg-white/40 border border-[#AE906080] ${inputCss.placeholderCustom} p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-[300] placeholder-custom resize-none`}
                    rows={4}
                    required
                    aria-required="true"
                    title="Type your message here"
                />
            </FormGroup>

            <button
                type="submit"
                className="bg-[#AE9060] text-[18px] sm:text-[20px] text-white px-4 py-2 rounded-[4px] w-full mt-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading}
            >
                {loading ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
}
