// middleware/requireSuperAdmin.js
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || !req.user.isSuperUser) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};
