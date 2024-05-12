import { envs } from "../../config";
import { CategoryModel, ProductModel, UserModel } from "../mongo";
import { MongoDatabase } from "../mongo/mongo-database";
import { seedData } from "./data";

// Funcion anonima asincrona autoinvocada
(async() => {
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL,
    })

    await main();

    await MongoDatabase.disconnect();
})();

const randomBetween0andX = ( x: number ) => {
    return Math.floor(Math.random() * x );
}

async function main() {

    // 0. Borrar Todo
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ])

    // 1. Crear Usuarios
    const users = await UserModel.insertMany( seedData.users );

    // 2. Crear Categorias
    const categories = await CategoryModel.insertMany(
        seedData.categories.map( category => {
            return {
                ...category,
                user: users[0]._id
            }
        })
    )

    // 3. Crear Productos
    const products = await ProductModel.insertMany(
        seedData.products.map( product => {
            return {
                ...product,
                user: users[randomBetween0andX( seedData.users.length - 1)]._id,
                category: categories[randomBetween0andX( seedData.categories.length - 1) ]._id,
            }
        })
    )

    console.log('SEEDED');

}