import { checkIfUserExists, isPasswordValid } from "../service/userServices.js";
import { generateToken } from "../utils/jwt.js";
import { logActivity } from "../utils/logger.js";
import { userMessages, authMessages } from "../constants/messages.js";

// Login existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await checkIfUserExists(email);

    if (!user) {
      await logActivity({ action: "Login Failed", message: `User not found: ${email}` });
      return res.status(404).json({ message: userMessages.USER_NOT_FOUND });
    }
console.log("qwer")
    const isValid = await isPasswordValid(password, user.password);
    if (!isValid) {
      await logActivity({ action: "Login Failed", userId: user.id, message: authMessages.INVALID_PASSWORD });
      return res.status(401).json({ message: authMessages.INVALID_PASSWORD });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    await logActivity({ action: "Login Success", userId: user.id, message: `User ${email} logged in.` });

    const { password: _, ...safeUser } = user;
    res.json({ message: authMessages.LOGIN_SUCCESS, token, user: safeUser });
  } catch (err) {
    await logActivity({ action: "Login Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};
