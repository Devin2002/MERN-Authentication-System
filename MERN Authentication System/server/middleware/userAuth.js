import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  let token = req.cookies?.token;

  // Fallback: check Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access! No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Store userId inside req.user (standard practice)
    req.user = { userId: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access! Invalid token",
    });
  }
};

export default userAuth;
