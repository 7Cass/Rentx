import { inject, injectable } from "tsyringe";
import { AppError } from "@shared/errors/AppError";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

interface IRequest {
    id: string;
    user_id: string;
};

@injectable()
class DevolutionRentalUseCase {

    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({ id, user_id }: IRequest): Promise<Rental> {
        const rental = await this.rentalsRepository.findById(id);
        const car = await this.carsRepository.findById(id);
        
        if (!rental) {
            throw new AppError("Rental does not exists!", 404);
        }
        
        if (!car) {
            throw new AppError("Car does not exists!", 404);
        }

        let daily = this.dateProvider.compareInDays(
            rental.start_date,
            this.dateProvider.dateNow()
        )

        if (daily <= 0) daily = 1; // 1 Diária

        const delay = this.dateProvider.compareInDays(
            this.dateProvider.dateNow(),
            rental.expected_return_date
        );

        let total = 0;

        if (delay > 0) {
            const calculateFine = delay * car.fine_amount;
            total = calculateFine;
        }

        total += daily * car.daily_rate;

        rental.end_date = this.dateProvider.dateNow();
        rental.total = total;

        await this.rentalsRepository.create(rental);
        await this.carsRepository.updateAvailable(car.id, true);

        return rental;
    }
};

export { DevolutionRentalUseCase };