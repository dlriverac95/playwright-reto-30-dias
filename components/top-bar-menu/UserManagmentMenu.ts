import {Locator, Page} from "@playwright/test";

export class UserManagmentMenu {

    private page:Page
    readonly userManagement: Locator
    readonly usersOption: Locator

    constructor(page:Page) {
        this.page = page
        this.userManagement = page.getByRole('navigation', { name: 'Topbar Menu' }).getByText('User Management')
        this.usersOption = page.getByRole('menuitem', { name: 'Users' })
    }

    private async clickOnUserManagement(){
        await this.userManagement.click()
    }

    async clickOnUsers(){
        await this.clickOnUserManagement()
        await this.usersOption.click()
    }
}