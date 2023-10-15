import ctrlWrapper from "../helpers/ctrlWrapper.js";
import httpError from "../helpers/httpError.js";
import { Contact } from "../models/contact-model.js";

const getAllContacts = async (req, res) => {
    const result = await Contact.find();
    res.status(200).json(result);
}

const getContactById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
        throw httpError(404, "Not found");
    }
    res.json(result);
}

const addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
}

const updateContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body)
    if (!result) {
        throw httpError(404, "Not found");
    }
    res.json(result);
}

const updateFavorite = async (req, res) => {
    const { id } = req.params;

    const result = await Contact.findByIdAndUpdate(id, req.body);
    if (!result) {
        throw httpError(404, `Contact with ${id} not found`);
    }

    res.json(result);
}

const deleteContactById = async (req, res) => {
    const { id } = req.params;

    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
        throw httpError(404, `Contact with ${id} not found`);
    }

    res.json({
        message: "Delete success"
    })
}

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    updateFavorite: ctrlWrapper(updateFavorite),
    deleteContactById: ctrlWrapper(deleteContactById),
}