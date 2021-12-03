import { v4 as uuid } from "uuid";
import { Column, CreateDateColumn, Entity } from "typeorm";

@Entity("users")
class User {
    @Column()
    id: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    driver_license: string;

    @Column()
    isAdmin: boolean;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
};

export { User };