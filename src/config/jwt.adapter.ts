import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED; 

export class JwtAdapter {

    // DI? si no necesito DI, trabajaremos con metodos estaticos

    static generatetoken ( payload: object, duration: string = '2h' ) {
        return new Promise ((resolve) => {
            jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
                if ( err ) return resolve(null);
    
                return resolve(token);
            });
        });
    };


    static validateToken<T>(token: string): Promise<T | null> {
        return new Promise( (resolve) => {

            jwt.verify( token, JWT_SEED, (err, decoded) => {

                if( err ) return resolve(null);

                resolve(decoded as T);
            });
        })
    }

} 