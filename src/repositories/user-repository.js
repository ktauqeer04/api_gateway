const crudRespository = require("./crud-repository");
const { User } = require('../models');


class UserRepository extends crudRespository{
    constructor(){
        super(User);
    }

    async getByEmails(email){
        const response = await User.findAll({
            where: {
                email: email
            }
        })
    }

}

module.exports = UserRepository;