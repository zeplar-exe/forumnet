import { MikroORM } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";

export var orm: MikroORM<MariaDbDriver>

MikroORM.init<MariaDbDriver>({
    entities: [ "./dist/models/entities" ],
    entitiesTs: [ "./models/entities" ],
    dbName: "forumnet-db",
    type: "mariadb"
}).then(
    driver => { orm = driver }, 
    failure_reason => { throw new Error(`Failed to initialize MikroORM with MariDB: ${failure_reason}`) }
)