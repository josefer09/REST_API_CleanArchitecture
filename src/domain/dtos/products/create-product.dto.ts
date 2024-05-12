import { Validators } from "../../../config";


export class CreateProductDto {
    private constructor(
        public readonly name: string,
        public readonly avalable: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string, // ID
        public readonly category: string, // ID

    ){}

    static create( props: { [key: string]: any} ): [string?, CreateProductDto?] {
        // Properties como variables
        const {
            name,
            available,
            price,
            description,
            user,
            category,

        } = props;

        if( !name ) return ['Mising name'];
        if( !user ) return ['Mising user'];
        if( !Validators.isMongoID(user) ) return ['Invalid User ID'];
        if( !category ) return ['Mising Category'];
        if( !Validators.isMongoID(category) ) return ['Invalid Category ID'];

        return [
            undefined,
            new CreateProductDto(
                name,
                !!available,
                price,
                description,
                user,
                category,
            )
        ]
    }

}