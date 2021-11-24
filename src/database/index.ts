import { createConnection, getConnectionOptions } from 'typeorm';

interface IOptions {
    host: string;
}

getConnectionOptions().then(options => {
    const newOptions = options as IOptions;
    newOptions.host = 'database' // Deve ser igual ao nome do service do banco de dados no docker-compose
    createConnection({
        ...options
    });
});

