import User from "../models/userModel.js";

// =================== GET USER DATA ===================
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.user; // ✅ Now comes from middleware, not req.body

    const user = await User.findById(userId).select("name isAccountVerified"); // ✅ Use imported User model

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
