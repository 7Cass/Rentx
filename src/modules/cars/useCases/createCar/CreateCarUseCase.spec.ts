import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

    it("Should be able to create a new car", async () => {
        const car = await createCarUseCase.execute({
            name: "Test Car",
            description: "Test Description",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "category"
        });

        expect(car).toHaveProperty("id");
    });

    it("Should not be able to create a car with existing license plate", () => {
        expect(async () => {
            await createCarUseCase.execute({
                name: "Test Car",
                description: "Test Description",
                daily_rate: 100,
                license_plate: "ABC-1234",
                fine_amount: 60,
                brand: "Brand",
                category_id: "category"
            });

            await createCarUseCase.execute({
                name: "Test Car 2",
                description: "Test Description",
                daily_rate: 100,
                license_plate: "ABC-1234",
                fine_amount: 60,
                brand: "Brand",
                category_id: "category"
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should be able to create a car available by default", async () => {
        const car = await createCarUseCase.execute({
            name: "Test Car Available",
            description: "Test Description",
            daily_rate: 100,
            license_plate: "ABC-1111",
            fine_amount: 60,
            brand: "Brand",
            category_id: "category"
        });

        expect(car.available).toBe(true);
    });
});