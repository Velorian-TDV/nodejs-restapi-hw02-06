import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

const userSchema = new Schema({
    email: {
        type: String,
        match: emailPattern,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, 'Set password for user'],
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
    },
    avatarURL: {
        type: String
    }
}, { versionKey: false, timestamps: true });

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);
userSchema.post('findOneAndUpdate', handleSaveError);

export const userRegistrationJoiSchema = Joi.object({
    email: Joi
        .string().required()
        .pattern(emailPattern)
        .messages({
            "string.email": "Invalid email format",
            "any.required": "missing required email field",
        }),
    password: Joi.string()
        .required()
        .min(6)
        .messages({
            "string.min": "Password length must be at least 6 characters long",
            "any.required": "missing required password field"
        })
})

export const userAuthorizationJoiSchema = Joi.object({
    email: Joi
        .string()
        .required()
        .pattern(emailPattern)
        .messages({
            "string.email": "Invalid email format",
            "any.required": "missing required email field",
        }),
    password: Joi
        .string()
        .required()
        .min(6)
        .messages({
            "string.min": "Password length must be at least 6 characters long",
            "any.required": "missing required password field"
        })
})

const User = model('user', userSchema);

export default User;