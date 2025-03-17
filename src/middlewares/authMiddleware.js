const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const { ErrorResponse } = require('../utils/commons');


const validateAuthRequest = (req, res, next) => {

    if(!req.body.email) {

        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError(['Email not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    if(!req.body.password) {

        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError(['password not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

const checkAuth = async (req, res, next) => {
    try {

        const token = req.headers.authorization;
        const response = await UserService.isAuthenticated(token);
        if(response){
            req.userId = response;
            next();
        }

    } catch (error) {

        ErrorResponse.error = error;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);

    }
}

const isAdmin = async (req, res, next) => {

    try {
        
        const response = await UserService.isAdmin(req.userId);

        if(!response){
            return res.status(StatusCodes.FORBIDDEN).json("Access denied. Admin role required");
        }

        next();

    } catch (error) {

        ErrorResponse.error = error;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);

    }

}

module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin
}
