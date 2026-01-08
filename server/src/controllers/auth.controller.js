import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message: 'User already exists.' });
    };

    const newUser = await User.create({ name, email, password });
    await newUser.save();

    const jwtToken = generateToken(newUser._id);

    res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
        .status(201)
        .json({ message: 'User registered successfully.' })
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    };

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const jwtToken = generateToken(user._id);

    res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
        .status(200)
        .json({ message: 'Login successful.' })
};

const logoutUser = (req, res) => {
    res.clearCookie("token");
    return res
        .status(200)
        .json({ message: 'Logout successful.' })
};

export {
    registerUser,
    loginUser,
    logoutUser
};