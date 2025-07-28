import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const deleteLogsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Both startDate and endDate are required." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    const deleted = await prisma.log.deleteMany({
      where: {
        timestamp: {
          gte: start,
          lte: end,
        },
      },
    });

    res.json({
      message: `Deleted ${deleted.count} log(s) from ${start.toISOString()} to ${end.toISOString()}`,
    });
  } catch (err) {
    console.error("Error deleting logs:", err);
    res.status(500).json({ error: "Failed to delete logs." });
  }
};
