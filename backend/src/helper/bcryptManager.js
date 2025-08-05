import bcrypt from "bcrypt";

// Function to hash a password
async function EncryptData(password, saltRounds) {
  return await bcrypt.hash(password, saltRounds);
}

// Function to compare a plain text password with a hashed password
async function compareEncryptedData(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}


export {
  EncryptData,
  compareEncryptedData
}