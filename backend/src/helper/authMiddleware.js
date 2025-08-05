import { verifyToken } from "../helper/jwtManager.js";
import { assert } from "../errors/assertError.js";
import { findUserById } from "../repository/user.repository.js";

const authenticateUser = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    //  Check token presence and format
    assert(token, "UNAUTHORIZED", "Token Missing");
    assert(
      token.startsWith("Bearer "),
      "UNAUTHORIZED",
      "Authorization failed: 'Bearer' token is missing or malformed."
    );

    token = token.split(" ")[1]; 

    const userPayload = verifyToken(token); 

    assert(userPayload?.id, "UNAUTHORIZED", "Invalid token payload");
    // Find user and validate status
    const user = await findUserById(userPayload.id);
    assert(user, "UNAUTHORIZED", "User not found");
    assert(user.status === "ACTIVE", "BLOCKED", "User is blocked");
    req.user = user;
    next();
  } catch (err) {
    next(err); 
  }
};

export { authenticateUser };
