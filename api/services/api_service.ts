export interface ApiService {
    getLockdownStatus(): boolean
    setLockdownStatus(is_locked: boolean)
}

export class ApiServiceImpl implements ApiService {
    is_locked: boolean

    getLockdownStatus(): boolean {
        return this.is_locked
    }

    setLockdownStatus(is_locked: boolean) {
        this.is_locked = is_locked
    }
}