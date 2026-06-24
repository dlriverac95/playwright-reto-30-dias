import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/loginPage';
import { TopBarMenu } from '../components/top-bar-menu/TopBarMenu';
import { SideMenuOption, SidePanel } from "../components/SidePanel";

test.describe('HRM navigation bar', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.loginAsAdmin()
        const sidePanel = new SidePanel(page)
        await expect(sidePanel.listOptions(SideMenuOption.ADMIN)).toBeVisible()
    })

    test('Check left menu options', async ({ page }) => {
        const expectedMenuItems = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info', 'Performance', 'Dashboard', 'Directory', 'Maintenance', 'Claim', 'Buzz']
        const currentMenuItems: string[] = []
        const menuItems = page.getByLabel('Sidepanel').getByRole('listitem')
        const currentMenuItemsCount = await menuItems.count()
        console.log(`Current menu items count: ${currentMenuItemsCount}`)

        for (let i = 0; i < currentMenuItemsCount; i++) {
            const menuText = await menuItems.nth(i).innerText()
            currentMenuItems.push(menuText)
        }
        console.log(currentMenuItems)

        await expect(currentMenuItems).toEqual(expectedMenuItems)
        await expect(currentMenuItems[0]).toBe(expectedMenuItems[0])
    })

    test('Navigate through left menu options', async ({ page }) => {
        const menuItems = page.getByLabel('Sidepanel').getByRole('listitem')
        const currentMenuItemsCount = await menuItems.count()

        for (let i = 0; i < currentMenuItemsCount; i++) {
            const menuItem = menuItems.nth(i)
            const menuText = await menuItem.innerText()

            console.log(`Current menu item: ${menuText}`)

            if (menuText !== "Maintenance") {
                await menuItem.click()
            }
            else {
                await page.goBack()
            }

            /* Possible alternative to the above if-else statement:
            if (menuText === 'Maintenance') {
                continue
            }
            await menuItem.click()
            */
        }
    })

    test('Check all the qualifications links', async ({ page }) => {

        const expectedPages = [
            {
                menu: 'Skills',
                url: '/web/index.php/admin/viewSkills'
            },
            {
                menu: 'Education',
                url: '/web/index.php/admin/viewEducation'
            },
            {
                menu: 'Licenses',
                url: '/web/index.php/admin/viewLicenses'
            }
        ]

        await page.getByRole('link', { name: 'Admin' }).click()
        await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('Qualifications').click()

        const qualificationOptions = page.getByRole('menu').locator('li')

        for (let expectedPage of expectedPages) {
            const menuOption = qualificationOptions.filter({ hasText: expectedPage.menu })

            await menuOption.click()
            await expect(page).toHaveURL(new RegExp(expectedPage.url))
            await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('Qualifications').click()
        }
    })

    test('Check all the configuration links', async ({ page }) => {

        const expectedPages = [
            {
                menu: 'Email Configuration',
                url: '/web/index.php/admin/listMailConfiguration'
            },
            {
                menu: 'Email Subscriptions',
                url: '/web/index.php/admin/viewEmailNotification'
            },
            {
                menu: 'Localization',
                url: '/web/index.php/admin/localization'
            },
            {
                menu: 'Language Packages',
                url: '/web/index.php/admin/languagePackage'
            },
            {
                menu: 'Modules',
                url: '/web/index.php/admin/viewModules'
            },
            {
                menu: 'Social Media Authentication',
                url: '/web/index.php/admin/openIdProvider'
            },
            {
                menu: 'Register OAuth Client',
                url: '/web/index.php/admin/registerOAuthClient'
            },
            {
                menu: 'LDAP Configuration',
                url: '/web/index.php/admin/ldapConfiguration'
            }
        ]

        await page.getByRole('link', { name: 'Admin' }).click()
        await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('Configuration').click()

        const configurationOptions = page.getByRole('menu').locator('li')

        for (let expectedPage of expectedPages) {
            const menuOption = configurationOptions.filter({ hasText: expectedPage.menu })

            await menuOption.click()
            await expect(page).toHaveURL(new RegExp(expectedPage.url))
            await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('Configuration').click()
        }

    })

    test('Check top bar menu options', async ({ page }) => {        
        const sidePanel = new SidePanel(page)
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)

        const topBarMenu = new TopBarMenu(page)
        await topBarMenu.userManagment.clickOnUsers()
        await topBarMenu.job.clickOnJobTitles()
        await topBarMenu.job.clickOnPayGrades()
        await topBarMenu.organization.clickOnGeneralInformation()
        await topBarMenu.organization.clickOnLocations()
        await topBarMenu.qualifications.clickOnSkills()
        await topBarMenu.qualifications.clickOnEducation()

    })

})