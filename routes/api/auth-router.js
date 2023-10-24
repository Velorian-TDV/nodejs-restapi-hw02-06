import express from 'express';
import authController from '../../controllers/auth-controller.js';
import isEmptyBody from '../../middlewares/isEmptyBody.js';
import authenticate from '../../middlewares/authenticate.js';
import validateBody from '../../helpers/validateBody.js';
import { userAuthorizationJoiSchema, userRegistrationJoiSchema } from '../../models/user-model.js';

const authRouter = express.Router();
const userRegistrationValidate = validateBody(userRegistrationJoiSchema);
const userAuthorizationValidate = validateBody(userAuthorizationJoiSchema);

authRouter.post('/register', isEmptyBody, userRegistrationValidate, authController.registration);
authRouter.post('/login', isEmptyBody, userAuthorizationValidate, authController.authorization);
authRouter.get('/current', authenticate, authController.getCurrent);
authRouter.post('/logout', authenticate, authController.logOut)

export default authRouter;