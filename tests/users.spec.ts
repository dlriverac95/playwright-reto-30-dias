import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/loginPage';
import { SidePanel, SideMenuOption } from "../components/SidePanel";
import { UserManagmentMenu } from '../components/top-bar-menu/UserManagmentMenu';


test.describe('HRM users table', () => {
    /*
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.loginAsAdmin()
        const sidePanel = new SidePanel(page)
        await expect(sidePanel.listOptions(SideMenuOption.ADMIN)).toBeVisible()
    });
    */
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

    test('Filter by user admin', async ({ page }) => {
        const sidePanel = new SidePanel(page)
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)

        //Esperar carga de la tabla
        await expect(page.locator('.oxd-table-card').first()).toBeVisible()

        const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')

        //Filas que contienen el role admin
        const currentAdminRows = allBodyRows.filter({
            has: page.getByRole('cell').nth(2).getByText('Admin')
        })

        const expectedAdminCount = await currentAdminRows.count()
        console.log('Admin users before filtering: ', expectedAdminCount)

        // Aplicar filtro
        await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
        await page.getByRole('listbox').getByRole('option', { name: 'Admin' }).click()
        await page.getByRole('button', { name: 'Search' }).click()

        //Esperar recarga de la tabla
        await expect(page.locator('.oxd-table-card').first()).toBeVisible()

        //La tabla filtrada deberia tener exactamente la misma cantiadad que encontramos
        const adminRowsAfterFiltering = allBodyRows.filter({
            has: page.getByRole('cell').nth(2).getByText('Admin')
        })
        const adminCount = await adminRowsAfterFiltering.count()
        console.log('Admin users after filtering: ', adminCount)

        await expect(expectedAdminCount).toEqual(adminCount)

    })

    test('Add new user', async ({ page }) => {
        const randomUsername = 'CosmeFulanito' + crypto.randomUUID().slice(0, 5);
        const password = Math.random().toString(36).slice(-8); // Generate a random password
        const employeeToSearch = "Andrew  Hisham"

        await page.goto('/web/index.php/dashboard/index')
        const sidePanel = new SidePanel(page)
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)
        const topBarMenu = new UserManagmentMenu(page)
        await topBarMenu.clickOnUsers()

        await page.getByRole('button', { name: 'Add' })
            .click()

        //fill the form
        //Select user role
        await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div")
            .click()
        await page.getByRole('listbox').getByRole('option', { name: 'ESS' })
            .click()
        //Fill employee name
        await page.getByRole('textbox', { name: 'Type for hints...' })
            .fill(employeeToSearch)
        await page.getByText(employeeToSearch, { exact: true }).nth(0)
            .click()
        //Select user status
        await page.locator('div.oxd-grid-item--gutters')
            .filter({ has: page.getByText('Status') })
            .locator('div.oxd-select-text-input')
            .click()
        await page.getByText('Enabled', { exact: true }).click()
        //Fill username
        await page.locator('div.oxd-grid-item--gutters')
            .filter({ has: page.getByText('Username') })
            .getByRole('textbox')
            .fill(randomUsername)
        //Fill password
        await page.locator('div.oxd-grid-item--gutters')
            .filter({ has: page.getByText('Password', {exact : true}) })
            .getByRole('textbox')
            .fill(password)
        //Fill confirm password
        await page.locator('div.oxd-grid-item--gutters')
            .filter({ has: page.getByText('Confirm Password', {exact : true}) })
            .getByRole('textbox')
            .fill(password)
        //Click save
        await page.getByRole('button', {name: "Save"}).click()
        //Confirme creation message
        await expect(page.locator('p.oxd-text--toast-message')).toHaveText('Successfully Saved')
    })
}); 