const { StatusCodes } = require("http-status-codes");
const { Auth, Enums } = require("../utils/commons");
const AppError = require("../utils/errors/app-error");
const { checkPassword, hashPassword } = require("../utils/commons/auth");
const { UserRepository, RoleRepository } = require('../repositories');


const userRepository = new UserRepository();
const roleRepository = new RoleRepository();



const signIn = async (data) => {

    try {
        
        const { email, password } = data;
        const user = await userRepository.getByEmails(email);

        if(!user){
            throw new AppError("User Doesn't exists", StatusCodes.NOT_FOUND);
        }

        const passwordMatch = await checkPassword(password, user.password);

        if(!passwordMatch){
            throw new AppError("Incorrect Password", StatusCodes.BAD_REQUEST);
        }

        const jwt = Auth.createToken({id: user.id, email: user.email});
        return jwt;

    } catch (error) {

        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);

    }

}

const signUp = async (data) => {
    
    try {
        
        const findUser = await userRepository.getByEmails(data.email)

        if(findUser){
            console.log(findUser);
            throw new AppError("Email Already Exists, please login", StatusCodes.FORBIDDEN)
        }

        const hashedPass = await hashPassword(data.password);

        data.password = hashedPass;
        console.log(data)
        const user = await userRepository.create(data);

        const role = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER);
        console.log(role);
        
        user.addRole(role);
        
        return user;

    } catch (error) {

        console.log(error);
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);

    }

}


const isAuthenticated = async (token) => {

    try {
        
        if(!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }

        const response = Auth.verifyToken(token);
        const user = await userRepository.get(response.id);
        
        if(!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }

        return user.id;

    } catch (error) {

        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);

    }

}


const isAdmin = async (id) => {
    try {
        
        const user = await userRepository.get(id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }

        const adminrole = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
        if(!adminrole) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }

        return user.hasRole(adminrole);

    } catch (error) {
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


const addRoleToUser = async (data) => {

    try {
        
        const { id, role } = data;
        const user = await userRepository.get(id);

        if(!user){
            throw new AppError('User with this id is not found', StatusCodes.NOT_FOUND);
        }

        const adminrole = await roleRepository.getRoleByName(role);

        if(!adminrole){
            throw new AppError("This Role doesn't exists", StatusCodes.NOT_FOUND);
        }

        user.addRole(role);
        return user;

    } catch (error) {
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

}


module.exports = {
    signIn,
    signUp,
    isAuthenticated,
    isAdmin,
    addRoleToUser
}