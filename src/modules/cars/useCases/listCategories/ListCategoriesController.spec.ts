import { Connection } from "typeorm";
import request from "supertest";
import { hash } from "bcrypt";
import { v4 as uuid } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("List Categories", () => {

    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();

        const id = uuid();
        const password = await hash("admin", 8);

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
                values('${id}', 'admin', 'admin@rentx.com', '${password}', 'true', 'now()', 'XXXXXXX')
            `
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to list all categories", async () => {
        const loginResponse = await request(app).post("/sessions").send({
            email: "admin@rentx.com",
            password: "admin",
        }); 

        const { refresh_token } = loginResponse.body;


        await request(app).post("/categories").send({
            name: "Category Supertest", 
            description: "Category Supertest" 
        }).set({ Authorization: `Bearer ${refresh_token}` });

        const response = await request(app).get("/categories");

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0]).toHaveProperty("id");
        expect(response.body.data[0].name).toEqual("Category Supertest");
    });
});