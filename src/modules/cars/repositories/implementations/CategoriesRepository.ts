import { getRepository, Repository } from "typeorm";
import { Category } from "../../entities/Category";
import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from "../ICategoriesRepository";

class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const category = this.repository.create({
      name,
      description
    });

    console.log(category)

    await this.repository.save(category);
  }

  async list(): Promise<Category[]> {
    return await this.repository.find();
  }

  async findByName(name: string): Promise<Category | undefined> {
    return await this.repository.findOne(name);
  }
}

export { CategoriesRepository };
