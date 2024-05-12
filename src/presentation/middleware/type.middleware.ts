import { Request, Response, NextFunction } from "express";

export class TypeMiddleware {
  // Factory Function
  static validTypes(validTypes: string[]) {
    // Generando la funcion dentro de otra funcion
    return (req: Request, res: Response, next: NextFunction) => {
        const type = req.url.split('/').at(2) ?? ''; // esto porque no podemos extrear los params cuando el middleware se usa de manera global
      if (!validTypes.includes(type)) {
        return res
          .status(400)
          .json({ errpr: `Invalid type: ${type}, valid ones ${validTypes}` });
      }
      next();
    };
  }
}
