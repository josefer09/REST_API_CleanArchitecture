import { Request, Response, NextFunction } from "express";

export class FileUploadMiddleware {

    static containFile(req: Request, res: Response, next: NextFunction) {
        if( !req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were selected '});
        }

        // Si esto no es un arreglo, es porque es el objeto de la imagen... y si es el objeto de la imagen lo coloco dentro del body files y creare mi arreglo unicamente con la imagen
        if ( !Array.isArray(req.files.file)) {
            req.body.files = [ req.files.file ];
        } else { // De caso contrario, si es un arreglo y lo colocaremos entonces en el punto file
            req.body.files = req.files.file; // el "file" de files.file es el nombre de la llave del archivo
        }

        next();
    }
}