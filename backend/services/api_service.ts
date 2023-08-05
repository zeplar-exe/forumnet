export interface ApiService {
    init(): Promise<void>
    getLockdownStatus(): Promise<boolean>
    setLockdownStatus(is_locked: boolean): Promise<void>
}

export class ApiServiceImpl implements ApiService {
    is_locked: boolean
    
    async init() {

    }

    async getLockdownStatus() {
        return this.is_locked
    }

    async setLockdownStatus(is_locked: boolean) {
        this.is_locked = is_locked
    }
}