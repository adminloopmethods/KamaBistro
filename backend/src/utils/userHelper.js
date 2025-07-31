import bcrypt from "bcrypt";

export const validatePasswordFields = (password, cnfmpassword) => {
    if (typeof password !== "string" || typeof cnfmpassword !== "string") {
        throw new Error("Password and confirmation must be strings.");
    }
    if (password !== cnfmpassword) {
        throw new Error("Passwords do not match.");
    }

    const structureCheck = validatePasswordStructure(password);
    if (structureCheck !== true) {
        throw new Error(structureCheck);
    }
};

export const validatePasswordStructure = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters.";
    if (!hasUpperCase) return "Password must include at least one uppercase letter.";
    if (!hasLowerCase) return "Password must include at least one lowercase letter.";
    if (!hasNumber) return "Password must include at least one number.";
    if (!hasSymbol) return "Password must include at least one special character.";

    return true;
};

// Compare plain and hashed password
export const validatePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
