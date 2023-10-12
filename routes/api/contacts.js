import express from "express";
import contacts from "../../controllers/contacts.js";
import validateBody from "../../middlewares/validateBody.js";
import addSchema from "../../schemas/contacts.js";

const router = express.Router();

router.get("/", contacts.listContacts);

router.get("/:id", contacts.getContactById);

router.post("/", validateBody(addSchema), contacts.addContact);

router.delete("/:id", contacts.removeContact);

router.put("/:id", validateBody(addSchema), contacts.updateContact);

export default router;