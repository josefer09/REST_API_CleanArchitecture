import { Response, Request } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload_service";
import { UploadedFile } from "express-fileupload";

export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ msg: error.message });
    }

    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error " });
  };

  uploadFile = (req: Request, res: Response) => {
    const type = req.params.type;
    const file = req.body.files[0] as UploadedFile;

    this.fileUploadService
      .uploadSingle(file, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };

  uploadMultipleFile = (req: Request, res: Response) => {
    const type = req.params.type;
    const files = req.body.files as UploadedFile[];

    this.fileUploadService
      .uploadMultiple(files, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };
}
