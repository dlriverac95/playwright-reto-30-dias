import { test, expect } from '@playwright/test';
import { SidePanel, SideMenuOption } from "../../components/SidePanel";
import { UserManagmentMenu } from '../../components/top-bar-menu/UserManagmentMenu';
import { Navigate } from '../../pageobjects/Navigate';
import { AddNewUserPage } from '../../pageobjects/AddNewUserPage';
import { UserFactory } from '../../factory/UserFactory';
import { UsersTable } from '../../components/UsersTable';


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

        const sidePanel = new SidePanel(page);
        await sidePanel.clickOnOption(SideMenuOption.ADMIN);

        // Esperar carga de la tabla
        await expect(page.locator('.oxd-table-card').first()).toBeVisible();

        const usersTable = new UsersTable(page);
        const userNames = await usersTable.getAllUsernames();

        console.log('Usernames: ', userNames);
    });

    test('Get all the employee names registered', async ({ page }) => {
        const navigate = new Navigate(page);
        await navigate.goToDashboard();

        const sidePanel = new SidePanel(page);
        await sidePanel.clickOnOption(SideMenuOption.ADMIN);

        // Esperar carga de la tabla
        await expect(page.locator('.oxd-table-card').first()).toBeVisible();

        const usersTable = new UsersTable(page);
        const employeeNames = await usersTable.getAllEmployeeNames();

        console.log('Employee Names: ', employeeNames);
    });


    test('Select specific user for edition', async ({ page }) => {
        const navigate = new Navigate(page);
        await navigate.goToDashboard();

        const sidePanel = new SidePanel(page);
        await sidePanel.clickOnOption(SideMenuOption.ADMIN);

        const usersTable = new UsersTable(page);

        // 1. Esperar a que la tabla cargue
        await expect(page.locator('.oxd-table-card').first()).toBeVisible();

        // 2. Obtener lista de usuarios (excluyendo 'Admin') delegando al POM
        const usernames = await usersTable.getAvailableUsernames('Admin');


        expect(usernames.length, 'No hay usuarios disponibles para editar aparte del Admin').toBeGreaterThan(0);

        // 3. Seleccionar uno al azar
        const randomIndex = Math.floor(Math.random() * usernames.length);
        const selectedUsername = usernames[randomIndex];
        console.log(`Selected user for editing: ${selectedUsername}`);

        // 4. Editar usando el POM
        await usersTable.editUserByUsername(selectedUsername);

        // 5. Validar que se abrió el formulario del usuario correcto
        const usernameInput = page.locator("//label[contains(.,'Username')]/parent::div/following-sibling::div/input");

        await expect(usernameInput).toHaveValue(selectedUsername);
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

        const usersTable = new UsersTable(page)

        // Esperar carga inicial
        await expect(page.locator('.oxd-table-card').first()).toBeVisible()

        const currentAdminRows = await usersTable.getAdminRows()
        const expectedAdminCount = await currentAdminRows.count()

        // Aplicar filtro
        await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
        await page.getByRole('listbox').getByRole('option', { name: 'Admin' }).click()
        await page.getByRole('button', { name: 'Search' }).click()

        const adminRowsAfterFiltering = await usersTable.getAdminRows()
        await expect(adminRowsAfterFiltering).toHaveCount(expectedAdminCount)
    })

    test('Add new valid Admin user', async ({ page }) => {
        // Arrange
        const navigate = new Navigate(page)
        const sidePanel = new SidePanel(page)
        const userManagementMenu = new UserManagmentMenu(page)
        const addNewUserPage = new AddNewUserPage(page)
        const usersTable = new UsersTable(page)

        // Act
        await navigate.goToDashboard()
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)
        await userManagementMenu.clickOnUsers();
        await usersTable.editFirstAdminOnTheTable()
        const fullUserToSearch = await addNewUserPage.getEmployeeName()
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
        const usersTable = new UsersTable(page)

        // Act
        await navigate.goToDashboard()
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)
        await userManagementMenu.clickOnUsers()
        await usersTable.editFirstAdminOnTheTable()
        const fullUserToSearch = await addNewUserPage.getEmployeeName()
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
        const usersTable = new UsersTable(page)

        // Act
        await navigate.goToDashboard();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)
        await userManagementMenu.clickOnUsers()
        await usersTable.editFirstESSOnTheTable()
        const fullUserToSearch = await addNewUserPage.getEmployeeName()
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
        const usersTable = new UsersTable(page)

        // Act
        await navigate.goToDashboard();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)
        await userManagementMenu.clickOnUsers();
        await usersTable.editFirstAdminOnTheTable()
        const fullUserToSearch = await addNewUserPage.getEmployeeName()
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
        const usersTable = new UsersTable(page)

        // Act
        await navigate.goToDashboard();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        await sidePanel.clickOnOption(SideMenuOption.ADMIN);
        await userManagementMenu.clickOnUsers();
        await usersTable.editFirstESSOnTheTable()
        const fullUserToSearch = await addNewUserPage.getEmployeeName()
        const ESSUser = UserFactory.createESSUserWithDisabledStatus({
            employeeName: fullUserToSearch
        });
        await page.goBack()
        await addNewUserPage.createUser(ESSUser)

        // Assert
        await addNewUserPage.expectUserCreated()
    })
})
