import { Request, Response } from "express";
import { container } from "tsyringe";
import { Category } from "../../entities/Category";
import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

class ListCategoriesController {

  async handle(request: Request, response: Response): Promise<Response> {
    const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);

    const categories = await listCategoriesUseCase.execute();

    return response.status(200).json({ data: categories });
  }
}

export { ListCategoriesController };
