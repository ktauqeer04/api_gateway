const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ServerConfig } = require('../../config');

const checkPassword = async (userPass, dbPass) => {
    try {
        return await bcrypt.compare(userPass, dbPass);
    } catch (error) {
        console.log(error);
        throw error;    
    }
}

const createToken = async (data) => {
    try {
        return jwt.sign(data, ServerConfig.JWT_SECRET);
    } catch (error) {
        console.log(error);
        throw error;   
    }
}

const verifyToken = async (data) => {
    try {
        return jwt.verify(data, ServerConfig.JWT_SECRET);
    } catch (error) {
        console.log(error);
        throw error;   
    }
}

const hashPassword = async (password) => {
    const saltrounds = 10;
    return await bcrypt.hash(password, saltrounds); 
}

module.exports = {
    checkPassword,
    createToken,
    verifyToken,
    hashPassword
}
