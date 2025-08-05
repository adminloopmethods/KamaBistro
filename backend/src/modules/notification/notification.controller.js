import {
  clearAllNotification,
  getAllNotification,
  markAllNotification,
  markNotification,
} from "./notification.service.js";

// const GetAllNotification = async (req, res) => {
//   const { id } = req.params;
//   const { page, limit, search } = req.query;
//   const notifications = await getAllNotification(id, page, limit, search);
//   res.status(200).json(notifications);
// };

const GetAllNotification = async (req, res) => {
  const { id } = req.params;
  const { page, limit, search } = req.query;

  const result = await getAllNotification(id, parseInt(page), limit, search);

  res.status(200).json({
    message: "Notifications fetched successfully",
    data: result.notifications,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    }
  });
};

const MarkNotification = async (req, res) => {
  const { id } = req.params;
  const mark = await markNotification(id);
  res.status(200).json(mark);
};

const MarkAllNotification = async (req, res) => {
  const { id } = req.params;
  const mark = await markAllNotification(id);
  res.status(200).json(mark);
};


const ClearAllNotification = async (req, res) => {
  const { id } = req.params;
  const result = await clearAllNotification(id);
  res.status(200).json(result);
};


export default { GetAllNotification, MarkNotification, MarkAllNotification, ClearAllNotification };
