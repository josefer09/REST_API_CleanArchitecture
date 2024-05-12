import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";
import { Uuid } from "../../config";
import { CustomError } from "../../domain";

export class FileUploadService {
  constructor(
    private readonly uuid = Uuid.v4,
  ) {}

  // Confirmar si el folder existe
  private checkFolder(folderPath: string) {
    // Si no existe el folder path, entonces crearemos el folderPath
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  async uploadSingle(
    file: UploadedFile,
    folder: string = "uploads",
    validExtensions: string[] = ["png", "jpg", "jpeg", "gif", "jfif"]
  ) {
    try {
      const fileExtension = file.mimetype.split("/").at(1) ?? ''; // en la segunda posicion por ser arreglo

      if( !validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(`Invalid extension: ${ fileExtension }, valid ones ${ validExtensions }`);
      }
      const destination = path.resolve(__dirname, "../../../", folder);
      this.checkFolder(destination);
      // crear el nombre del archivo
      const fileName = `${ this.uuid() }.${ fileExtension }`;
      // Vamos a colocarlo
      file.mv(`${destination}/${ fileName }`);
      return {fileName};
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  async uploadMultiple(
    files: UploadedFile[],
    folder: string = "uploads",
    validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
  ) {

    const filesNames = await Promise.all(
        files.map( file => this.uploadSingle(file, folder, validExtensions)) // por cada archivo lo guarda como si fuera uno
    );

    return filesNames;
  }
}
