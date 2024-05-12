import { CustomError } from "../errors/custom.error";


export class UserEntity {

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public emailValidate: boolean,
        public password: string,
        public userName: string,
        public role: string[],
        public img?: string,
    ){}

    static fromObject( object: { [key:string]: any } ) {
        const { id, _id, name, email, emailValidated, password, userName, role, img} = object;

        if(!_id && !id) {
            throw CustomError.badRequest('Missing id');
        }

        // if(!name) throw CustomError.badRequest('Missing name');
        // if(!name) throw CustomError.badRequest('Missing name');
        // if(!name) throw CustomError.badRequest('Missing name');
        // if(!name) throw CustomError.badRequest('Missing name');
        // if(!name) throw CustomError.badRequest('Missing name');

        if([name, email, emailValidated, password, role, userName].includes('')) throw CustomError.badRequest('Missing data');

        return new UserEntity(_id||id, name, email, emailValidated, password, userName, role, img);
    }
}