import User from "../models/user-model.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import httpError from "../helpers/httpError.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import 'dotenv/config';

const { JWT_SECRET } = process.env;

const registration = async (req, res) => {
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.findOne({ email });
    if (user) {
        throw httpError(409, "Email in use");
    }

    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription
    })
}

const authorization = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passwordCompare = await bcrypt.compare(password, user.password);
    const payload = { id: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });

    if (!user) throw httpError(401, "Email or password invalid");
    if (!passwordCompare) throw httpError(401, "Email or password invalid");

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token: token,
        user: {
            email: user.email,
            subscription: user.subscription
        }
    });
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription
    })
}

const logOut = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.status(204).json({
        message: "Logout success"
    })
}

export default {
    registration: ctrlWrapper(registration),
    authorization: ctrlWrapper(authorization),
    getCurrent: ctrlWrapper(getCurrent),
    logOut: ctrlWrapper(logOut)
}