import { ProductModel } from "../../data";
import { CustomError, PaginationDto } from "../../domain";
import { CreateProductDto } from '../../domain/dtos/products/create-product.dto';

export class ProductService {

    // DI
    constructo() {}

    async createProduct(createProductDto: CreateProductDto) {
        const productExist = await ProductModel.findOne({ name: createProductDto.name });
        if ( productExist ) throw CustomError.badRequest('Product alredy exist');

        try {
            const product = new ProductModel( createProductDto );
            await product.save();
            return product;
        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Server Error');
        }
    }


    async getProducts( paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            
            const [ total, products ] = await Promise.all( [
                ProductModel.countDocuments(),
                ProductModel.find()
                .skip(( page - 1) * limit )
                .limit( limit )
                .populate('user') //Me trae los datos del usuario
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/categories?pages=${ ( page + 1) }&limit=${ limit }`,
                prev: (page - 1 > 0) ? `/api/categories?page=${ ( page -1 )}&limit=${ limit }`: null,

                products: products
            }
        } catch (error) {
            throw CustomError.internalServer('Internal Server Error');
        }
        
    }
}