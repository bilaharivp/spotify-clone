const User = require("../models/User");

const getUserProfile = async (req, res) => {
  try {
    const email = req.user.email; // Assuming authenticateToken middleware sets req.user from token payload
    const user = await User.findOne({ email }).select("firstname email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ firstname: user.firstname, email: user.email });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error fetching user profile" });
  }
};

module.exports = { getUserProfile };
