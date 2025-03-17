const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/commons");


const signUp = async (req, res) => {

    try {

        const { email, password } = req.body;
        const response = await UserService.signUp({ email, password });
        SuccessResponse.data = response;

        return res.status(StatusCodes.OK).json(SuccessResponse);
        
    } catch (error) {
        
    }
}


const signIn = async (req, res) => {

    try {

        const { email, password } = req.body;
        const response = await UserService.signIn({ email, password });
        SuccessResponse.data = response;

        return res.status(StatusCodes.OK).json(SuccessResponse);
        
    } catch (error) {

        ErrorResponse.error = error;
        return res.status(error.StatusCodes).json(ErrorResponse);

    }
}


const addrole = async (req, res) => {

    try {
        
        const { id, role } = req.body;
        const response = await UserService.addRoleToUser({ id, role });
        SuccessResponse.data = response;

        return res.status(StatusCodes.OK).json(SuccessResponse);

    } catch (error) {
        
        ErrorResponse.error = error;
        return res.status(error.StatusCodes).json(ErrorResponse);

    }

}

module.exports = {
    signIn,
    signUp,
    addrole
}