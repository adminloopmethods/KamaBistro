import crypto from 'crypto';

export const generateRandomOTP = () => crypto.randomInt(100000, 999999).toString();
