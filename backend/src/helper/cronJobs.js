import cron from "node-cron";
import {
  resetUserOtpAttempts,
  // sendNotifications,
} from "../repository/user.repository.js";
import {deleteNotification} from "../repository/notification.repository.js";
import { RunAndPublishScheduledVersion } from "../repository/content.repository.js";

// Global cron scheduler function
const scheduleCronJobs = () => {
  // Reset OTP attempts for users after 24 hours (runs every 1 minute to check)
  // Every * represents following (left to right)
  // Seconds (optional): 0 – 59
  // Minute: 0 – 59
  // Hour: 0 – 23
  // Day of the Month: 1 – 31
  // Month: 1 – 12
  // Day of the week: 0 – 7 (0 and 7 both represent Sunday)
  cron.schedule("0 0 * * *", async () => {
    await resetUserOtpAttempts();
    console.log("Checked for OTP attempt resets.");
  });
  
  cron.schedule("*/30 * * * *", async ()=>{
    await RunAndPublishScheduledVersion()
  })

  // Example: Send notifications every day at midnight
  // cron.schedule("0 0 * * *", async () => {
  //   await sendNotifications();
  //   console.log("Sent daily notifications.");
  // });

  // Delete old notifications after 7 days
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log(`[${new Date().toISOString()}] Starting cleanup job...`);
      await deleteNotification();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  // cron.schedule("*/1 * * * *", async () => {
  //   console.log(
  //     `[${new Date().toISOString()}] Starting cleanup job (every minute)`
  //   );
  //   await deleteNotification();
  // });

  // console.log("[Scheduler started: runs every minute]");
};

export {scheduleCronJobs};
