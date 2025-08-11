import { sendEmail } from "./sendEmail.js";

// Simple in-memory queue
const emailQueue = [];

// Worker function to process jobs
async function processQueue() {
  while (true) {
    if (emailQueue.length > 0) {
      const job = emailQueue.shift(); // Remove job from queue
      try {
        await sendEmail(job.payload);
        console.log("Email sent to", job.payload.to);
      } catch (err) {
        console.error("Failed to send email to", job.payload.to, err);
        // Optionally: retry logic or push back to queue
      }
    } else {
      // Wait a bit before checking again
      await new Promise((res) => setTimeout(res, 500));
    }
  }
}

// Start the worker
processQueue();

// Export a function to add jobs
export function addEmailJob(payload) {
  emailQueue.push({ payload });
} 