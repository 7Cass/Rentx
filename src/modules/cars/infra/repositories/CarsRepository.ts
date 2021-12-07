import { getRepository, Repository } from "typeorm";
import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Car } from "../typeorm/entities/Car";


class CarsRepository implements ICarsRepository {

    private respository: Repository<Car>;

    constructor() {
        this.respository = getRepository(Car);
    }

    async create({
        name,
        description,
        daily_rate,
        license_plate, 
        fine_amount,
        brand,
        category_id
    }: ICreateCarDTO): Promise<Car> {
        const car = this.respository.create({
            name,
            description,
            daily_rate,
            license_plate, 
            fine_amount,
            brand,
            category_id
        });

        await this.respository.save(car);

        return car;
    }
    async findByLicensePlate(license_plate: string): Promise<Car> {
        const car = await this.respository.findOne({ license_plate });

        return car;
    }
};

export { CarsRepository };