import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";
import { CreateCategoryDto, } from '../../domain/dtos/category/create-category.dto';
import { CategoryService } from "../services/category_service";
import { create } from "domain";


export class CategoryController {

    // DI
    constructor(
        private readonly categoryService: CategoryService,
    ){}

    private handleError = (error: unknown, res: Response) => {
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ msg: error.message });
        }

        console.log(error);
        return res.status(500).json({ msg: 'Internal Server Error '});
    }

    createCategory = async(req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
        if( error ) return res.status(400).json({ error });
        // res.json(createCategoryDto);
        this.categoryService.createCategory(createCategoryDto!, req.body.user)
        .then( category => res.status(201).json(category))
        .catch( error => this.handleError(error, res));



    }

    getCategories = async(req: Request, res: Response) => {

        const { page = 1, limit =10 } = req.query; // establezco valores por defecto
        const [error, paginationDto] = PaginationDto.create( +page, +limit ); // el + es para convertirlos a number
        if( error ) return res.status(400).json({ error });

        this.categoryService.getCategories( paginationDto! )
        .then( (categories) => res.json(categories))
        .catch( error => this.handleError(error, res));
    }
}