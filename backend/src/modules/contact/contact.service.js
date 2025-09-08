import prismaClient from "../../config/dbConfig.js";

export const createContactMessage = async ({ name, email, message }) => {
  return await prismaClient.contactMessage.create({
    data: {
      name,
      email,
      message,
    },
  });
};
