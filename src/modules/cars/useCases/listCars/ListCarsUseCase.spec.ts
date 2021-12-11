import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListCarsUseCase } from "./ListCarsUseCase";

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
    });

    it("Sould be able to list all available cars", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car 1",
            description: "Car Description",
            daily_rate: 110.00,
            license_plate: "DEF-1234",
            fine_amount: 60,
            brand: "Car Brand 1",
            category_id: "category_id"
        });
        
        const cars = await listCarsUseCase.execute({});

        expect(cars).toEqual([car]);
    });

    it("Should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car 2",
            description: "Car Description",
            daily_rate: 110.00,
            license_plate: "DEF-1234",
            fine_amount: 60,
            brand: "Car Brand 2",
            category_id: "category_id"
        });
        
        const cars = await listCarsUseCase.execute({
            brand: "Car Brand",
        });

        expect(cars).toEqual([car]);
    });
});