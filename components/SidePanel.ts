import { Page, Locator } from "playwright";

export class SidePanel {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    private menuOption(option: SideMenuOption): Locator {
        return this.page.locator('.oxd-sidepanel-body').getByRole('link', { name: option })
    }

    listOptions(option: SideMenuOption): Locator {
        return this.menuOption(option)
    }

    async clickOnOption(option: SideMenuOption) {
        await this.menuOption(option).click()
    }


    async searchAnOption(option: SideMenuOption) {
        await this.page.getByRole('textbox', { name: 'Search' }).fill(option)
    }
}

export enum SideMenuOption {
    ADMIN = 'Admin',
    PIM = 'PIM',
    LEAVE = 'Leave',
    TIME = 'Time',
    RECRUITMENT = 'Recruitment',
    MY_INFO = 'My Info',
    PERFORMANCE = 'Performance',
    DASHBOARD = 'Dashboard',
    DIRECTORY = 'Directory',
    MAINTENANCE = 'Maintenance',
    CLAIM = 'Claim',
    BUZZ = 'Buzz'
}

