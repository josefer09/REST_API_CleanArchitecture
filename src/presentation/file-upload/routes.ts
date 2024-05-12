import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file-upload_service";
import { FileUploadMiddleware } from "../middleware/file-upload.middleware";
import { TypeMiddleware } from "../middleware/type.middleware";



export class FileUploadRoutes {

    static get routes(): Router {
        const router = Router();
        const controller = new FileUploadController(new FileUploadService);

        router.use( [FileUploadMiddleware.containFile, TypeMiddleware.validTypes(['users', 'products', 'categories'])]); // De esta manera, no podran acceder a los params

        // Definir las rutas
        router.post( '/single/:type', controller.uploadFile);
        router.post( '/multiple/:type', controller.uploadMultipleFile);

        return router;
    }
}