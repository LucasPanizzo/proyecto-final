import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";
export const logoutController = (req,res)=>{
    try {
        req.session.destroy((error) => {
          if (error) console.log(error)
          res.redirect('/')
        })
    } catch {
        logger.error(ErrorsMessage.SESSION_INVALID_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.SESSION_ERROR,
            cause: ErrorsCause.SESSION_INVALID_CAUSE,
            message: ErrorsMessage.SESSION_INVALID_ERROR
        });
    }
}

