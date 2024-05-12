import { regularExps } from "../../../config";


export class RegisterUserDto {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly userName: string,
    ) {}

    static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { name, email, password, userName } = object;

        if( !name ) return ['Mising name'];
        if( !email ) return ['Missing email'];
        if( !regularExps.email.test(email)) return ['Email is not valid'];
        if( !userName) return ['Mising userName'];
        if( !password ) return ['Missing password'];
        if( password.length < 6 ) return ['Password too short'];

        return [undefined, new RegisterUserDto(name, email, password, userName)];
    }
}