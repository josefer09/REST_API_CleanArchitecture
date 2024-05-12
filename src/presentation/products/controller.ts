import { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";
import { ProductService } from "../services/product_service";

export class ProductController {
  // DI
  constructor(private readonly productService: ProductService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ msg: error.message });
    }

    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error " });
  };

  createProduct = (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id,
    });
    if (error) return res.status(400).json({ error });

    this.productService
      .createProduct(createProductDto!)
      .then((product) => res.status(201).json(product))
      .catch((error) => this.handleError(error, res));
  };

  getProducts = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query; // establezco valores por defecto
    const [error, paginationDto] = PaginationDto.create(+page, +limit); // el + es para convertirlos a number
    if (error) return res.status(400).json({ error });

    this.productService
      .getProducts(paginationDto!)
      .then((products) => res.json(products))
      .catch((error) => this.handleError(error, res));
  };
}
