export const userMessages = {
  USER_NOT_FOUND: "User not found or access restricted.",
  USER_UPDATED: (email) => `User ${email} updated successfully.`,
  USER_DELETED: (email) => `User ${email} has been soft-deleted.`,
  USER_FETCHED: (email) => `Fetched user ${email}.`,
  USER_LIST_FETCHED: "Fetched all users.",
  INVALID_PASSWORD: "Invalid password attempt.",
  USER_ALREADY_EXISTS: "User already exists."
};


export const passwordErrors = {
  PASSWORD_UNMATCHED: "Both passwords must match.",
  PASSWORD_TYPE_ERROR: "Invalid password format.",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters long.",
};


export const authMessages = {
  INVALID_PASSWORD: "Invalid password attempt.",
  LOGIN_SUCCESS: "Login successful.",
  LOGIN_FAILED: "Login failed. Please check your credentials.",
  UNAUTHORIZED: "Unauthorized access.",
  TOKEN_EXPIRED: "Session expired. Please log in again.",
};

