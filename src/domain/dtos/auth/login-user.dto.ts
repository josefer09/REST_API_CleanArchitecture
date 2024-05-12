import { regularExps } from "../../../config";

export class LoginUserDto {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ){}

    static login( object: { [key: string]: any } ): [string?, LoginUserDto?] {
        const { email, password } = object;

        if( !email ) return ['Mising email'];
        if( !password ) return ['Mising password'];

        return [undefined, new LoginUserDto(email, password)];
    }


}