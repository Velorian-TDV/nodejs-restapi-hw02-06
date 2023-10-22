import express from 'express';
import contacts from '../../controllers/contacts-controller.js';
import idValidation from '../../middlewares/idValidation.js';
import isEmptyBody from '../../middlewares/isEmptyBody.js';
import validateBody from '../../helpers/validateBody.js';
import { contactJoiAddSchema, contactJoiUpdateFavoriteSchema } from '../../models/contact-model.js';

const router = express.Router();
const contactValidate = validateBody(contactJoiAddSchema);
const contactUpdateFaviruteValidate = validateBody(contactJoiUpdateFavoriteSchema);

router.get('/', contacts.getAllContacts);
router.get('/:id', idValidation, contacts.getContactById);
router.post('/', isEmptyBody, contactValidate, contacts.addContact);
router.put('/:id', isEmptyBody, idValidation, contactValidate, contacts.updateContact);
router.patch('/:id/favorite', idValidation, contactUpdateFaviruteValidate, contacts.updateFavorite);
router.delete('/:id', idValidation, contacts.deleteContactById);

export default router;