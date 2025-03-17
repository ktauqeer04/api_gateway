const crudRespository = require("./crud-repository");
const { User, Role } = require('../models');


class UserRepository extends crudRespository{
    constructor(){
        super(User);
    }

    async getByEmails(email){
        const response = await User.findOne({
            where: {
                email: email
            },
            include: {
                model: Role,
                as: "role",
                attributes: ["name"] 
            }        
        });
        return response
    }

}

module.exports = UserRepository;