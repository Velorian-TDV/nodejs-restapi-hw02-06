import { isValidObjectId } from "mongoose";

const idValidation = (req,res,next) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return next(httpError(404, `${id} not valid id`));
    }

    next();

}

export default idValidation;