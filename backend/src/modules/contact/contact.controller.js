import { createContactMessage } from "./contact.service.js";

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log(name, email, message, "helll")

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const savedMessage = await createContactMessage({ name, email, message });
    res.status(201).json({ success: true, data: savedMessage });
  } catch (error) {
    console.error("Error saving contact form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
