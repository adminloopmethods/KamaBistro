import { useState, useEffect } from "react";
import xSign from "../../assets/icons/x-close.png";
import checkSign from "../../assets/icons/check.png";


const passwordValidationRules = [
    {
        text: "Password must be at least 8 characters long.",
        test: (password) => password.length >= 8,
    },
    {
        text: "Password must contain at least one uppercase letter.",
        test: (password) => /[A-Z]/.test(password),
    },
    {
        text: "Password must contain at least one lowercase letter.",
        test: (password) => /[a-z]/.test(password),
    },
    {
        text: "Password must contain at least one digit.",
        test: (password) => /\d/.test(password),
    },
    {
        text: "Password must contain at least one special character (@, $, !, %, *, ?, &).",
        test: (password) => /[@$!%*?&]/.test(password),
    },
];

const PasswordValidation = ({ new_password }) => {
    const [validationStatus, setValidationStatus] = useState(
        passwordValidationRules.map(() => false)
    );

    useEffect(() => {
        const status = passwordValidationRules.map((rule) => rule.test(new_password));
        setValidationStatus(status);
    }, [new_password]);

    return (
        <ul className={`${new_password.length > 0 ? "block" : "hidden"}`}>
            {passwordValidationRules.map((rule, index) => (
                <li
                    key={index}
                    className={`text-[10px] flex gap-1 ${validationStatus[index] ? "text-green-600" : "text-red-600"
                        }`}
                >
                    <img src={validationStatus[index] ? checkSign : xSign} className="h-3 translate-y-[4px]" /> {rule.text}
                </li>
            ))}
        </ul>
    );
};

function validatePasswordMessage(password, setter) {
    if (password.length > 0) {
        for (let rule of passwordValidationRules) {
            if (!rule.test(password)) {
                if(setter) setter(rule.text);
                return 0;
            }
        }
        return 1
    }
    return 0
}

export { validatePasswordMessage }
export default PasswordValidation;
