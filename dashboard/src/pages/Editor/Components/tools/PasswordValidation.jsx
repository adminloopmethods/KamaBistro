import { useState, useEffect, useRef } from "react";
import xSign from "../../../../assets/icons/x-close.png"
import checkSign from "../../../../assets/icons/check.png"


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
  const [show, setShow] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const status = passwordValidationRules.map((rule) =>
      rule.test(new_password)
    );
    setValidationStatus(status);

    const allPassed = status.every(Boolean);
    const anyTyped = new_password.length > 0;

    // Clear any pending hide delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!anyTyped) {
      setShow(false);
    } else if (!allPassed) {
      setShow(true); // Show immediately if any rule fails
    } else {
      // All passed — wait 500ms before hiding
      timeoutRef.current = setTimeout(() => {
        setShow(false);
      }, 600);
    }
  }, [new_password]);

  return (
    <ul
      className={`${show ? "block" : "hidden"
        }  z-[20]  bg-white p-4 rounded-xl`}
    >
      {passwordValidationRules.map((rule, index) => (
        <li
          key={index}
          className={`text-[11px] flex gap-1 ${validationStatus[index] ? "text-green-600" : "text-red-600"
            }`}
        >
          <img
            src={validationStatus[index] ? checkSign : xSign}
            className="h-3 translate-y-[4px]"
            alt={validationStatus[index] ? "Check" : "X"}
          />
          {rule.text}
        </li>
      ))}
    </ul>
  );
};

const validatePasswordMessage = (password) => {
  if (password.length === 0) return "Password is required";

  for (const rule of passwordValidationRules) {
    if (!rule.test(password)) {
      return rule.text; // ❌ return the failing rule message
    }
  }

  return null; // ✅ no error, password is valid
};


export { validatePasswordMessage }
export default PasswordValidation;
