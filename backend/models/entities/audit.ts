import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { base64uuid } from "../../common/custom_uuid.js";
import { AuditType } from "../enums/audit_type.js";

@Entity()
export class Audit {
    @PrimaryKey()
    id: string
    
    @Enum()
    type: AuditType

    @Property({ type: "datetime" })
    timestamp: Date

    @Property()
    fields: string

    constructor(type: AuditType, timestamp: Date, fields: string) {
        this.id = base64uuid()
        this.type = type
        this.timestamp = timestamp
        this.fields = fields
    }
}