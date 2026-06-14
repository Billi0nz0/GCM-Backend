const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../middleware/emailService");


exports.register = async (req, res) => {
    try {
        const fullName = req.body.fullName?.trim();
        const username = req.body.username?.toLowerCase().trim();
        const email = req.body.email?.toLowerCase().trim();
        const password = req.body.password;

        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const exists = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (exists) {
            return res.status(409).json({
                message:
                    exists.email === email
                        ? "Email already exists"
                        : "Username already in use"
            });
        }

        const user = await userModel.create({
            fullName,
            username,
            email,
            password,
            role: "admin"
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase().trim();
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.isBanned) {
            return res.status(403).json({
                message: "Your account is banned"
            });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // set true in production (HTTPS)
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getMe = async (req, res) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.params._id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.getUsers = async (req, res) => {
    const users = await userModel.find().select("-password");
    res.status(200).json({ users });
};

exports.updateProfile = async (req, res) => {
    try {
        const { _id } = req.params;
        const { username, profilePhoto } = req.body;

        const user = await userModel.findById(_id);

        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }

        if (username) {

            const existingUser =
                await userModel.findOne({
                    username: username.toLowerCase().trim(),
                    _id: { $ne: _id }
                });

            if (existingUser) {
                return res.status(400).json({
                    message: "Username already exists"
                });
            }

            user.username =
                username.toLowerCase().trim();
        }

        if (profilePhoto) {

            const FOUR_MONTHS = 1000 * 60 * 60 * 24 * 30 * 4;

            if (user.oldPhotoUpdate) {

                const diff =
                    Date.now() -
                    new Date(
                        user.oldPhotoUpdate
                    ).getTime();

                if (diff < FOUR_MONTHS) {

                    const daysLeft = Math.ceil(
                        (FOUR_MONTHS - diff) /
                        (1000 * 60 * 60 * 24)
                    );

                    return res.status(403).json({
                        message:
                        `You can change your profile photo again in ${daysLeft} days`
                    });
                }
            }

            user.profilePhoto = profilePhoto;

            user.oldPhotoUpdate = new Date();
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}; 

exports.toggleBanUser = async (req, res) => {
    try {
        const { isBanned } = req.body;

        if (typeof isBanned !== "boolean") {
            return res.status(400).json({ message: "isBanned must be true or false" });
        }

        const user = await userModel.findById(req.params._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user.id === req.params._id) {
            return res.status(400).json({ message: "You cannot ban yourself" });
        }

        if (user.role === "superAdmin") {
            return res.status(403).json({ message: "Cannot ban a superAdmin" });
        }

        user.isBanned = isBanned;
        await user.save();

        res.status(200).json({
        message: isBanned
            ? "User has been banned"
            : "User has been unbanned",
        user,
        });
    } catch (error) {
        console.error("Ban User Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const { _id } = req.params;

        const user = await userModel.findById(_id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "superAdmin") {
            return res.status(403).json({ message: "Cannot delete a superAdmin" });
        }

        await userModel.findByIdAndDelete(_id);

        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.error("Delete Profile Error", error.message);
        res.status(500).json({ message: "Server error" });
    }
};





exports.changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Old and new password are required"
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Old password is incorrect"
            });
        }

        //IMPORTANT: assign raw password only
        user.password = newPassword;

        await user.save();

        res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const input = req.body.emailOrUsername?.trim();

        if (!input) {
            return res.status(400).json({ message: "Field required" });
        }

        const user = await userModel.findOne({
            $or: [
                { email: input.toLowerCase() },
                { username: input.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(200).json({
                message: "If account exists, reset link sent"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashed = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashed;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetURL = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Password Reset",
            html: `<p>Reset here: <a href="${resetURL}">${resetURL}</a></p>`
        });

        res.status(200).json({
            message: "If account exists, reset link sent"
        });
    } catch (error) {
        console.error("Forgot Password Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const newPassword = req.body.newPassword;

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};
