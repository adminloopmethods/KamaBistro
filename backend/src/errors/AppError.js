import { statusCodes } from './statusCodes.js';

class AppError extends Error {
    constructor(errorName, customMessage, errorDetails) {
        const { code, message } = statusCodes[errorName] || { code: 500, message: "Unknown Error" }; // Default to 500 if not found
        super(customMessage || message);
        this.statusCode = code;
        this.errorType = message; // Use the message from statusCodes as errorType
        this.errorDetails = errorDetails;
        this.isOperational = true; // For distinguishing custom vs. server errors
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;