import { BcryptAdapter, JwtAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity, LoginUserDto } from "../../domain";
import { EmailService } from "./email-service";



export class AuthService {

    //DI
    constructor(
        // DI - Email Service
        private readonly emailService: EmailService
    ){}

    public async registerUser( registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('Email already exist');

        // Almacenar en db
        try {
            const user = new UserModel(registerUserDto);
            
            // Encriptar la contrasena
            user.password = BcryptAdapter.hash(registerUserDto.password);
            
            await user.save();

            // JWT <--------- Para mantener la autenticacion del usuario


            // Email de confirmacion
            this.sendEmailValidationLink( user.email );


            const { password, ...userEntity } = UserEntity.fromObject(user); // Separo la password con el resto de atributos del objeto obtenido

            const token = await JwtAdapter.generatetoken({id: user.id });

            if( !token ) throw CustomError.internalServer('Error while creating JWT');

            return {
                user: userEntity,
                token: token,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser( loginUserDto: LoginUserDto) {
        // Findone Para verificar si existe
        // isMatch ... bcryp...compare(123456, KJFLKDJlfdkj)

        const user = await UserModel.findOne({email: loginUserDto.email});
        const passwordDto = loginUserDto.password
        if(!user) throw CustomError.notFound('Email not exist');

        try {
            const { password, ...userEntity } = UserEntity.fromObject(user)

            // is match
            const isMatch = BcryptAdapter.compare(loginUserDto.password, password);

            if ( !isMatch ) throw CustomError.badRequest('Password incorrect');

            const token = await JwtAdapter.generatetoken({id: user.id });

            if( !token ) throw CustomError.internalServer('Error while creating JWT');

            //const user = { name, userName, email };
            return {
                user: userEntity,
                token: token,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }


        // return {
        //     user: {... info del usuario},
        //     token: {'Token generado'}
        // };
    }

    private async sendEmailValidationLink( email: string ) {

        const token = await JwtAdapter.generatetoken({ email });
        if ( !token ) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${ token }`;

        const html = `
        <h1>Validate your email</h1>
        <p>Click on the following link to validate your email</p>
        <a href="${ link }">Validarte your email: ${ email }</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail(options);
        if( !isSent ) throw CustomError.internalServer('Error sending email');

        return true;
    }


    public async validateEmail(token: string) {
        const payload = await JwtAdapter.validateToken(token);
        if( !payload ) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email: string };
        if( !email ) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({ email });
        if ( !user ) throw CustomError.internalServer('Email not exist');

        user.emailValidated = true;
        await user.save();

        return true;

    }
}