import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

const phonePattern = /^\+(?:\d{12}|\d{10}|\d{2}\s\d{3}\s\d{3}\s\d{4}|\d{2}-\d{3}-\d{3}-\d{4}|\d{2}-\d{3}-\d{3}-\d{2}-\d{2}|\d{2}\s\d{3}\s\d{3}\s\d{2}\s\d{2})$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        match: emailPattern,
        required: true
    },
    phone: {
        type: String,
        match: phonePattern,
        required: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false, timestamps: true });

contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);
contactSchema.post('findOneAndUpdate', handleSaveError);

export const contactJoiAddSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required(),
    email: Joi.string()
        .pattern(emailPattern)
        .messages({
            "string.pattern.base": "Invalid email format",
            "any.required": "missing required email field",
        }),
    phone: Joi.string()
        .required()
        .pattern(phonePattern)
        .messages({
            "string.pattern.base": "The correct number format should be one of: +xxxxxxxxxxxx, +xx xxx xxx xxxx, +xx-xxx-xxx-xxxx, +xx-xxx-xxx-xx-xx, +xx xxx xxx xx xx, Where: +(2 digit is country code), (next 3 digit mobile operator code), (next 7 digit your number)",
            "any.required": `missing required phone field`,
        }),
    favorite: Joi.boolean()
        .messages({
            "any.required": "missing field favorite",
        }),
});

export const contactJoiUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
})

export const Contact = model('contact', contactSchema);