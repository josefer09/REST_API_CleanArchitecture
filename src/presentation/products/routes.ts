import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ProductController } from "./controller";
import { ProductService } from "../services/product_service";

export class ProductRoutes {

    static get routes(): Router {
        const router = Router();
        const productService = new ProductService();
        const controller = new ProductController(productService);

        router.get('/', controller.getProducts);
        router.post('/', [AuthMiddleware.validateJWT], controller.createProduct);

        
        return router;
    }
}