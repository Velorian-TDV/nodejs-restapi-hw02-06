import ctrlWrapper from "../helpers/ctrlWrapper.js";
import httpError from "../helpers/httpError.js";
import { Contact } from "../models/contact-model.js";

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate('owner', 'email subscription');
    res.status(200).json(result);
}

const getContactById = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOne({ _id: id, owner });
    if (!result) {
        throw httpError(404, "Not found");
    }
    res.json(result);
    console.log(id)
    console.log(owner)
}

const addContact = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
}

const updateContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body)
    if (!result) {
        throw httpError(404, "Not found");
    }
    res.json(result);
}

const updateFavorite = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);
    if (!result) {
        throw httpError(404, `Contact with ${id} not found`);
    }

    res.json(result);
}

const deleteContactById = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOne({ _id: id, owner });
    if (!result) {
        throw httpError(404, `Not found`);
    }

    await Contact.findByIdAndRemove(id);

    res.json({
        message: "Contact deleted"
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