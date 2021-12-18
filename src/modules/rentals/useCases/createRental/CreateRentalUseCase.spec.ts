import "reflect-metadata";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import dayjs from "dayjs";

import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsProvider: DayjsDateProvider;

describe("Create Rental", () => {
    const add24Hours = dayjs().add(1, "day").toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        dayjsProvider = new DayjsDateProvider();
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayjsProvider, carsRepositoryInMemory);
    });

    it("Should be able to create a new rental", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car Test",
            description: "Car Test",
            brand: "Car Test",
            daily_rate: 100,
            license_plate: "Car Test",
            fine_amount: 40,
            category_id: "1234"
        });

        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: add24Hours
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("Should not be able to create a new rental if there's an open from the same user", async () => {

        await rentalsRepositoryInMemory.create({
            car_id: "111111",
            expected_return_date: add24Hours,
            user_id: "12345"
        });

        await expect(createRentalUseCase.execute({
                user_id: "12345",
                car_id: "121212",
                expected_return_date: add24Hours
            })
        ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
    });

    it("Should not be able to create a new rental if there's an open from the same car", async () => {

        await rentalsRepositoryInMemory.create({
            car_id: "test",
            expected_return_date: add24Hours,
            user_id: "12345"
        });

        await expect(createRentalUseCase.execute({
                user_id: "456",
                car_id: "test",
                expected_return_date: add24Hours
            })
        ).rejects.toEqual(new AppError("Car is unavailable!"));
    });

    it("Should not be able to create a new rental with invalid return time", async () => {

        await expect(createRentalUseCase.execute({
                user_id: "1234",
                car_id: "test",
                expected_return_date: dayjs().toDate()
            })
        ).rejects.toEqual(new AppError("Invalid return time!"));
    });
});