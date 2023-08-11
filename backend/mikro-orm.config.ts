import dotenv from 'dotenv'
dotenv.config() // I'm assuming MikroORM is doing some bs under the hood in order to run before index.ts, so this is required

import { Logger } from '@nestjs/common';

const logger = new Logger('MikroORM');

const mikroOrmConfig: any = {
    entities: [ "./dist/models/entities" ],
    entitiesTs: [ "./models/entities" ],
    name: "forumnet.maria.db",
    dbName: "forumnet",
    type: "mariadb",
    host: process.env.MARIADB_HOST,
    port: parseInt(process.env.MARIADB_PORT ?? "error"),
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    logger: logger.log.bind(logger)
}

export default mikroOrmConfig