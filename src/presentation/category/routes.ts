import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { CategoryService } from '../services/category_service';



export class CategoryRoutes {

    static get routes(): Router {
        const router = Router();
        const categoryService = new CategoryService();
        const controller = new CategoryController(categoryService);
        
        // Definir las rutas
        router.get('/', [AuthMiddleware.validateJWT], controller.getCategories );
        router.post('/', [ AuthMiddleware.validateJWT ], controller.createCategory ); // Se pone entre llaves ya que podemos enviar un arreglo de middlewares



        return router;
    }
}