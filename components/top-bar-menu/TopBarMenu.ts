import { Page } from "@playwright/test"
import { UserManagmentMenu } from "./UserManagmentMenu"
import { JobMenu } from "./JobMenu"
import { QualificationsMenu } from "./QualificationsMenu"
import { OrganizationMenu } from "./OrganizationMenu"

export class TopBarMenu {
    readonly page:Page 
    readonly userManagment: UserManagmentMenu
    readonly job: JobMenu
    readonly organization: OrganizationMenu
    readonly qualifications: QualificationsMenu

    constructor(page:Page){
        this.page = page
        this.userManagment = new UserManagmentMenu(page)
        this.job = new JobMenu(page)
        this.qualifications = new QualificationsMenu(page)
        this.organization = new OrganizationMenu(page)
    }
}

