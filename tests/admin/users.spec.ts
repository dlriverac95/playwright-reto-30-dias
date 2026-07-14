import { test, expect } from '@playwright/test';
import { SidePanel, SideMenuOption } from "../../components/SidePanel";
import { UserManagmentMenu } from '../../components/top-bar-menu/UserManagmentMenu';
import { Navigate } from '../../pageobjects/Navigate';
import { AddNewUserPage } from '../../pageobjects/AddNewUserPage';
import { UserModel } from '../../models/UserModel';
import { UserFactory } from '../../factory/UserFactory';


test.describe('Users section', () => {
    /*
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.loginAsAdmin()
        const sidePanel = new SidePanel(page)
        await expect(sidePanel.listOptions(SideMenuOption.ADMIN)).toBeVisible()
    });
    */
    test('Get all the usernames registered', async ({ page }) => {
        const navigate = new Navigate(page);
        await navigate.goToDashboard();
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
        const navigate = new Navigate(page);
        await navigate.goToDashboard();
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
        const navigate = new Navigate(page);
        await navigate.goToDashboard();
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
        const navigate = new Navigate(page);
        await navigate.goToDashboard();
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
        const navigate = new Navigate(page);
        await navigate.goToDashboard();
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
        const navigate = new Navigate(page);
        await navigate.goToDashboard();
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

    test('Add new valid Admin user', async ({ page }) => {
        // Arrange
        const navigate = new Navigate(page)
        const sidePanel = new SidePanel(page)
        const userManagementMenu = new UserManagmentMenu(page)
        const addNewUserPage = new AddNewUserPage(page)

        // Act
        await navigate.goToDashboard()
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)
        await userManagementMenu.clickOnUsers();
        await expect(page.locator('.oxd-table-card').first()).toBeVisible()
        const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
        const currentAdminRows = allBodyRows.filter({
            has: page.getByRole('cell').nth(2).getByText('Admin')
        })
        const firstAdminToSearch = currentAdminRows.nth(0)
        await expect(firstAdminToSearch, "No admin users found in the table").toHaveCount(1)
        await firstAdminToSearch.locator('button').filter({ has: page.locator('i.bi-pencil-fill') }).click()
        const employeeInput = page.getByPlaceholder('Type for hints...')
        await expect(employeeInput).not.toHaveValue('')
        const fullUserToSearch = await employeeInput.inputValue()
        const AdminUser = UserFactory.createAdminUser({
            employeeName: fullUserToSearch
        })
        await page.goBack()
        await addNewUserPage.createUser(AdminUser)

        // Assert
        await addNewUserPage.expectUserCreated()

    })

    test('Add new Admin user with invalid password', async ({ page }) => {
        // Arrange
        const navigate = new Navigate(page)
        const sidePanel = new SidePanel(page)
        const userManagementMenu = new UserManagmentMenu(page)
        const addNewUserPage = new AddNewUserPage(page)

        // Act
        await navigate.goToDashboard()
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)
        await userManagementMenu.clickOnUsers()
        await expect(page.locator('.oxd-table-card').first()).toBeVisible()
        const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
        const currentAdminRows = allBodyRows.filter({
            has: page.getByRole('cell').nth(2).getByText('Admin')
        })
        const firstAdminToSearch = currentAdminRows.nth(0)
        await expect(firstAdminToSearch, "No admin users found in the table").toHaveCount(1)
        await firstAdminToSearch.locator('button').filter({ has: page.locator('i.bi-pencil-fill') }).click()
        const employeeInput = page.getByPlaceholder('Type for hints...')
        await expect(employeeInput).not.toHaveValue('')
        const fullUserToSearch = await employeeInput.inputValue()
        const AdminUser = UserFactory.createAdminUserWithInvalidPassword({
            employeeName: fullUserToSearch
        });
        await page.goBack()
        await addNewUserPage.createUser(AdminUser)

        // Assert
        await addNewUserPage.expectUserCreationFailed()
    })

    test('Add new valid ESS user', async ({ page }) => {
        // Arrange
        const navigate = new Navigate(page)
        const sidePanel = new SidePanel(page)
        const userManagementMenu = new UserManagmentMenu(page)
        const addNewUserPage = new AddNewUserPage(page)

        // Act
        await navigate.goToDashboard();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)
        await userManagementMenu.clickOnUsers()
        await expect(page.locator('.oxd-table-card').first()).toBeVisible()
        const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
        const currentESSRows = allBodyRows.filter({
            has: page.getByRole('cell').nth(2).getByText('ESS')
        })
        const firstESSToSearch = currentESSRows.nth(0)
        await expect(firstESSToSearch, "No ESS users found in the table").toHaveCount(1)
        await firstESSToSearch.locator('button').filter({ has: page.locator('i.bi-pencil-fill') }).click()
        const employeeInput = page.getByPlaceholder('Type for hints...')
        await expect(employeeInput).not.toHaveValue('')
        const fullUserToSearch = await employeeInput.inputValue()
        const ESSUser = UserFactory.createEmployeeUser({
            employeeName: fullUserToSearch
        });
        await page.goBack()
        await addNewUserPage.createUser(ESSUser)

        // Assert
        await addNewUserPage.expectUserCreated()
    })

    test('Add new disabled Admin user', async ({ page }) => {
        // Arrange
        const navigate = new Navigate(page)
        const sidePanel = new SidePanel(page)
        const userManagementMenu = new UserManagmentMenu(page)
        const addNewUserPage = new AddNewUserPage(page)

        // Act
        await navigate.goToDashboard();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)
        await userManagementMenu.clickOnUsers();
        await expect(page.locator('.oxd-table-card').first()).toBeVisible()
        const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
        const currentAdminRows = allBodyRows.filter({
            has: page.getByRole('cell').nth(2).getByText('Admin')
        })
        const firstAdminToSearch = currentAdminRows.nth(0)
        await expect(firstAdminToSearch, "No Admin users found in the table").toHaveCount(1)
        await firstAdminToSearch.locator('button').filter({ has: page.locator('i.bi-pencil-fill') }).click()
        const employeeInput = page.getByPlaceholder('Type for hints...')
        await expect(employeeInput).not.toHaveValue('')
        const fullUserToSearch = await employeeInput.inputValue()
        const AdminUser = UserFactory.createAdminUserWithDisabledStatus({
            employeeName: fullUserToSearch
        });
        await page.goBack()
        await addNewUserPage.createUser(AdminUser)

        // Assert
        await addNewUserPage.expectUserCreated()
    })

    test('Add new disabled ESS user', async ({ page }) => {
        // Arrange
        const navigate = new Navigate(page)
        const sidePanel = new SidePanel(page)
        const userManagementMenu = new UserManagmentMenu(page)
        const addNewUserPage = new AddNewUserPage(page)

        // Act
        await navigate.goToDashboard();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        await sidePanel.clickOnOption(SideMenuOption.ADMIN);
        await userManagementMenu.clickOnUsers();
        await expect(page.locator('.oxd-table-card').first()).toBeVisible()
        const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
        const currentESSRows = allBodyRows.filter({
            has: page.getByRole('cell').nth(2).getByText('ESS')
        })
        const firstESSToSearch = currentESSRows.nth(0)
        await expect(firstESSToSearch, "No ESS users found in the table").toHaveCount(1)
        await firstESSToSearch.locator('button').filter({ has: page.locator('i.bi-pencil-fill') }).click()
        const employeeInput = page.getByPlaceholder('Type for hints...')
        await expect(employeeInput).not.toHaveValue('');
        const fullUserToSearch = await employeeInput.inputValue()
        const ESSUser = UserFactory.createESSUserWithDisabledStatus({
            employeeName: fullUserToSearch
        });
        await page.goBack()
        await addNewUserPage.createUser(ESSUser)

        // Assert
        await addNewUserPage.expectUserCreated()
    })
})
