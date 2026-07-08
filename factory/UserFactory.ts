import { UserModel } from "../models/UserModel";

export class UserFactory {

    private static defaultPassword = "Password123!";

    private static base(override?: Partial<UserModel>): UserModel {

        const defaultUser: UserModel = {
            username: 'user-' + crypto.randomUUID().slice(0, 5),
            employeeName: 'John Doe',
            password: this.defaultPassword,
            confirmPassword: this.defaultPassword,
            role: 'ESS',
            status: 'Enabled'
        }

        return { ...defaultUser, ...(override || {}) };

    }

    static createEmployeeUser(override?: Partial<UserModel>): UserModel {
        return this.base({ role: 'ESS', ...(override || {}) });
    }

    static createAdminUser(override?: Partial<UserModel>): UserModel {
        return this.base({ role: 'Admin', ...(override || {}) });
    }

    static createESSUserWithInvalidPassword(override?: Partial<UserModel>): UserModel {
        return this.base({ role: 'ESS', password: '123', ...(override || {}) });
    }

    static createAdminUserWithInvalidPassword(override?: Partial<UserModel>): UserModel {
        return this.base({ role: 'Admin', password: '123', ...(override || {}) });
    }
    static createESSUserWithDisabledStatus(override?: Partial<UserModel>): UserModel {
        return this.base({ role: 'ESS', status: 'Disabled', ...(override || {}) });
    }

    static createAdminUserWithDisabledStatus(override?: Partial<UserModel>): UserModel {
        return this.base({ role: 'Admin', status: 'Disabled', ...(override || {}) });
    }

}
