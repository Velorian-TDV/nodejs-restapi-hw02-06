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
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, { versionKey: false, timestamps: true });

contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);
contactSchema.post('findOneAndUpdate', handleSaveError);

export const contactJoiAddSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.min": "The minimum length is 2 characters",
            "string.max": "The maximum is 50 characters",
            "any.required": "missing required name field",
        }),
    email: Joi.string()
        .required()
        .pattern(emailPattern)
        .messages({
            "string.email": "Invalid email format",
            "any.required": "missing required email field",
        }),
    phone: Joi.string()
        .required()
        .pattern(phonePattern)
        .messages({
            "string.pattern.base": "The correct number format should be: +xxxxxxxxxxxx, +xx-xxx-xxx-xx-xx, +xx xxx xxx xx xx, +xx xxx xxx xxxx, +xx-xxx-xxx-xxxx",
            "any.required": "missing required phone field",
        }),
    favorite: Joi.boolean()
        .messages({
            "any.required": "missing field favorite",
        }),
});

export const contactJoiUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean()
        .required()
        .messages({
            "any.required": "missing field favorite",
        }),
})

export const Contact = model('contact', contactSchema);