import { Page, expect } from "@playwright/test";
import { SideMenuOption, SidePanel } from "../components/SidePanel";
import { UserManagmentMenu } from "../components/top-bar-menu/UserManagmentMenu";

export class Navigate {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToDashboard() {
        await this.page.goto('/web/index.php/dashboard/index')
    }

    async toUser(){
        const sidePanel = new SidePanel(this.page)
        const userManagementMenu = new UserManagmentMenu(this.page)
        await this.goToDashboard()
        await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
        await sidePanel.clickOnOption(SideMenuOption.ADMIN);
        await userManagementMenu.clickOnUsers();
    }

}
