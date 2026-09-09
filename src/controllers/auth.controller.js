import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

// Register
export const register = async (req, res) => {
const { name, email, password } = req.body;

const existUser = await userModel.findOne({ email });

if (existUser) {
return res.status(400).json({
message: "Email is already registered",
});
}

const hashedPassword = bcrypt.hashSync(password, 8);

const user = await userModel.create({
name,
email,
password: hashedPassword,
});

res.status(201).json({
message: "User registered successfully",
user: {
id: user._id,
name: user.name,
email: user.email,
},
});
};

// Login
export const login = async (req, res) => {
const { email, password } = req.body;

const existUser = await userModel.findOne({ email });

if (!existUser) {
return res.status(400).json({
message: "Invalid credentials",
});
}

const isMatch = bcrypt.compareSync(password, existUser.password);

if (!isMatch) {
return res.status(400).json({
message: "Invalid credentials",
});
}

const token = jwt.sign(
{
id: existUser._id,
email: existUser.email,
role: existUser.role,
},
process.env.JWT_SECRET
);

res.status(200).json({
message: `Hello ${existUser.name}`,
token,
});
};
