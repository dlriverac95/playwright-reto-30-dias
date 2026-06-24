import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/loginPage';
import { SidePanel, SideMenuOption } from "../components/SidePanel";


test.describe('HRM users table', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.loginAsAdmin()
        const sidePanel = new SidePanel(page)
        await expect(sidePanel.listOptions(SideMenuOption.ADMIN)).toBeVisible()
    });

    test('Get all the usernames registered', async ({ page }) => {
        await page.getByRole('link', { name: 'Admin' }).click()
        await page.getByRole('navigation', { name: 'Topbar Menu' }).getByText('User Management').click()
        await page.getByRole('menuitem', { name: 'Users' }).click()

        const rows = page.getByRole('table').getByRole('row')
        await expect(rows.first()).toBeVisible()
        const userNames: string[] = []
        const rowCount = await rows.count()

        for (let i = 1; i < rowCount; i++) {
            const cellUsername = rows.nth(i).getByRole('cell').nth(1)
            const username = await cellUsername.textContent()

            if (username) {
                userNames.push(username)
            }
        }
        console.log(userNames)
    });

    test('Get all the employee names registered', async ({ page }) => {
        await page.getByRole('link', { name: 'Admin' }).click()
        await page.getByRole('navigation', { name: 'Topbar Menu' }).getByText('User Management').click()
        await page.getByRole('menuitem', { name: 'Users' }).click()

        const rows = page.getByRole('table').getByRole('row')
        await expect(rows.first()).toBeVisible()
        const employeeNames: string[] = []
        const rowCount = await rows.count()

        for (let i = 1; i < rowCount; i++) {
            const cellEmployeeName = rows.nth(i).getByRole('cell').nth(3)
            const employeeName = await cellEmployeeName.textContent()

            if (employeeName) {
                employeeNames.push(employeeName)
            }
        }
        console.log(employeeNames)
    });


    test('Select specific user for edition', async ({ page }) => {
        await page.getByRole('link', { name: 'Admin' }).click()
        await page.getByRole('navigation', { name: 'Topbar Menu' }).getByText('User Management').click()
        await page.getByRole('menuitem', { name: 'Users' }).click()

        await expect(page.getByRole('table').getByRole('row').nth(1)).toBeVisible()
        const validRows = page.getByRole('table').getByRole('row')
        const usernames: string[] = [];
        for (let i = 1; i < await validRows.count(); i++) {
            var username = await validRows.nth(i).getByRole('cell').nth(1).innerText();
            if (username !== 'Admin') {
                usernames.push(username);
            }
        }

        const randomIndex = Math.floor(Math.random() * usernames.length);
        const selectedUsername = usernames[randomIndex];

        const pencilButton = page.getByRole('table').getByRole('row').filter({ hasText: selectedUsername }).locator('button').filter({ has: page.locator('i.bi-pencil-fill') });
        await pencilButton.click();


        const usernameInput = page.locator("//label[contains(.,'Username')]/parent::div/following-sibling::div/input")
        await expect(usernameInput).toHaveValue(selectedUsername);
        console.log(`Selected user for editing: ${selectedUsername}`);
        console.log(`Username input value: ${await usernameInput.inputValue()}`);
    });

    test('Check user role options', async ({ page }) => {
        const expectedRoleOptions = ['-- Select --', 'Admin', 'ESS']

        const sidePanel = new SidePanel(page)
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)

        await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
        const currentUserRoleOptions = await page.getByRole('listbox').getByRole('option').allInnerTexts()
        
        console.log(currentUserRoleOptions)
        expect(currentUserRoleOptions,
            'The options displayed in the User Role Dropdown do not match the expected options.').toEqual(expectedRoleOptions)
    });

    test('Check status options', async ({ page }) => {
        const expectedStatusOptions = ['-- Select --', 'Enabled', 'Disabled']

        const sidePanel = new SidePanel(page)
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)

        await page.locator("//label[contains(., 'Status')]/parent::div/following-sibling::div").click()
        const currentUserStatusOptions = await page.getByRole('listbox').getByRole('option').allInnerTexts()
        
        console.log(currentUserStatusOptions)
        expect(currentUserStatusOptions, 
            'The options displayed in the Status Dropdown do not match the expected options.').toEqual(expectedStatusOptions)
    });
});