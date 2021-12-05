import { AppError } from "../../../../errors/AppError";
import { CategoriesReposioryInMemory } from "../../repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRespositoryInMemory: CategoriesReposioryInMemory;

describe("Create Category", () => {
    beforeEach(() => {
        categoriesRespositoryInMemory = new CategoriesReposioryInMemory();
        createCategoryUseCase = new CreateCategoryUseCase(categoriesRespositoryInMemory);
    });

    it("Should be able to create a new category", async () => {
        const category = {
            name: "Category Test",
            description: "Category Description Test"
        };

        await createCategoryUseCase.execute({
            name: category.name,
            description: category.description,
        });

        const categoryCreated = await categoriesRespositoryInMemory.findByName(category.name);

        expect(categoryCreated).toHaveProperty("id");
    });

    it("Should not be able to create a new category with existing name", async () => {
        expect(async () => {
            const category = {
                name: "Category Test",
                description: "Category Description Test"
            };
    
            await createCategoryUseCase.execute({
                name: category.name,
                description: category.description,
            });
    
            await createCategoryUseCase.execute({
                name: category.name,
                description: category.description,
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});