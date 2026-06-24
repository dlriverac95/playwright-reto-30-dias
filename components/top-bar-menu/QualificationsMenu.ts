import {Page, Locator, LocatorScreenshotOptions} from "@playwright/test";


export class QualificationsMenu {
    
    private page:Page
    readonly qualifications: Locator
    readonly skillsOption: Locator
    readonly educationOption: Locator
    readonly licensesOption: Locator 
    readonly languagesOption: Locator
    readonly membershipsOption: Locator


    constructor(page:Page){
        this.page = page
        this.qualifications = page.getByRole('navigation', { name: 'Topbar Menu' }).getByText('Qualifications')
        this.skillsOption = page.getByRole('menuitem', { name: 'Skills' })
        this.educationOption = page.getByRole('menuitem', { name: 'Education' })
        this.licensesOption = page.getByRole('menuitem', { name: 'Licenses' })
        this.languagesOption = page.getByRole('menuitem', { name: 'Languages' })
        this.membershipsOption = page.getByRole('menuitem', { name: 'Memberships' })
    }

    private async clickOnQualifications(){
        await this.qualifications.click()
    }
    
    async clickOnSkills(){
        await this.clickOnQualifications()
        await this.skillsOption.click()
    }

    async clickOnEducation(){
        await this.clickOnQualifications()
        await this.educationOption.click()
    }

    async clickOnLicenses(){
        await this.clickOnQualifications()
        await this.licensesOption.click()
    }

    async clickOnLanguages(){
        await this.clickOnQualifications()
        await this.languagesOption.click()
    }

    async clickOnMemberships(){
        await this.clickOnQualifications()
        await this.membershipsOption.click()
    }
}
