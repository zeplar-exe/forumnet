import { existsSync, readFile, writeFile } from "fs"

export interface BackendConfig {
    maintainence_mode: boolean
    user_access_enabled: boolean
    posting_enabled: boolean
    forum_creation_enabled: boolean

    init(): Promise<void>
}

export class BackendConfigImpl implements BackendConfig {
    maintainence_mode: boolean
    user_access_enabled: boolean
    posting_enabled: boolean
    forum_creation_enabled: boolean
    
    async init() {
        const configFile = "backend_config.json"

        return // disabled temporarily

        if (!existsSync(configFile))
            writeFile(configFile, "{}", (err) => { throw err })

        readFile(configFile, "utf-8", (err, data) => {
            if (err) throw err

            const json = JSON.parse(data)

            const populate = (field: string, default_value: any) => {
                
                this[field] = json[field] ?? default_value
            }

            populate("maintainence_mode", true)
            populate("user_access_enabled", true)
            populate("posting_enabled", true)
            populate("forum_creation_enabled", true)
        })
    }
}