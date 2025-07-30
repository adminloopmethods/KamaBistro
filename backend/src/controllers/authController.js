import { generateToken } from "../utils/jwt.js";
import { logActivity } from "../utils/logger.js";
import { findActiveUserByEmail, validatePassword } from "../utils/userHelper.js";


// Login existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findActiveUserByEmail(email)

    if (!user) {
      await logActivity({ action: "Login Failed", message: `User not found or deleted: ${email}` });
      return res.status(404).json({ message: "User not found or deleted." });
    }

    const isValid = await validatePassword(password, user.password);
    if (!isValid) {
      await logActivity({ action: "Login Failed", userId: user.id, message: `Invalid password attempt.` });
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    await logActivity({ action: "Login Success", userId: user.id, message: `User ${email} logged in.` });

    const { password: _, ...safeUser } = user;
    res.json({ message: "Login successful", token, user: safeUser });
  } catch (err) {
    await logActivity({ action: "Login Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};
