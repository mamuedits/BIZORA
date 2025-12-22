import User from "../models/User.js";

const rolePrefixMap = {
  investor: "I",
  founder: "F",
  mentor: "M",
  collaborator: "C",
};

const generateUserId = async (role) => {
  const prefix = rolePrefixMap[role];
  if (!prefix) throw new Error("Invalid role");

  let userId;
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    userId = `${prefix}${randomNumber}`;
    exists = await User.findOne({ userId });
  }

  return userId;
};

export default generateUserId;
