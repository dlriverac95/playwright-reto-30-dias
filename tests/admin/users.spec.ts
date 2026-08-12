import { test, expect, request } from '@playwright/test';
import { SidePanel, SideMenuOption } from "../../components/SidePanel";
import { UserManagmentMenu } from '../../components/top-bar-menu/UserManagmentMenu';
import { Navigate } from '../../pageobjects/Navigate';
import { AddNewUserPage } from '../../pageobjects/AddNewUserPage';
import { UserFactory } from '../../factory/UserFactory';
import { UsersTable } from '../../components/UsersTable';
import { readFile } from "fs/promises";
import path from "path";


test.describe('Users section', () => {
    /*
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.loginAsAdmin()
        const sidePanel = new SidePanel(page)
        await expect(sidePanel.listOptions(SideMenuOption.ADMIN)).toBeVisible()
    });
    */

    test('API Get All the users', async ({ page, request }) => {

        const authFilePath = path.resolve(process.cwd(), '.auth', 'admin.json')

        const authState = JSON.parse(await readFile(authFilePath, 'utf-8')) as {
            cookies?: Array<{ name: string, value: string }>
        }

        const orangeHrmCookie = authState.cookies?.find(cookie => cookie.name == 'orangehrm')
        expect(orangeHrmCookie, 'The orangehrm cookie was not found in the saved auth state').toBeTruthy()

        const cookieHeader = `orangehrm=${orangeHrmCookie?.value}`

        const response = await request.get(
            'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users?limit=50&offset=0&sortField=u.userName&sortOrder=ASC',
            {
                headers: {
                    Cookie: cookieHeader,
                    Accept: 'application/json'
                }
            }
        )

        expect(response.ok()).toBeTruthy()

        const bodyJson = await response.json()
        console.log(JSON.stringify(await bodyJson))
    });

    test('API Add New User', async ({ page, request }) => {

        const authFilePath = path.resolve(process.cwd(), '.auth', 'admin.json')

        const authState = JSON.parse(await readFile(authFilePath, 'utf-8')) as {
            cookies?: Array<{ name: string, value: string }>
        }

        const orangeHrmCookie = authState.cookies?.find(cookie => cookie.name == 'orangehrm')
        expect(orangeHrmCookie, 'The orangehrm cookie was not found in the saved auth state').toBeTruthy()

        const cookieHeader = `orangehrm=${orangeHrmCookie?.value}`
        const username = 'user' + crypto.randomUUID().slice(0, 8)
        const password = 'Password*123'

        const response = await request.post(
            'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users',
            {
                headers: {
                    Cookie: cookieHeader,
                    Accept: 'application/json'
                },
                data: {"username":username,"password":password,"status":true,"userRoleId":1,"empNumber":3}
            }
        )

        expect(response.ok()).toBeTruthy()

        const bodyJson = await response.json()
        console.log(JSON.stringify(await bodyJson))
    });

    test('API Add New User with existing username should fail', async ({ page, request }) => {

        const authFilePath = path.resolve(process.cwd(), '.auth', 'admin.json')

        const authState = JSON.parse(await readFile(authFilePath, 'utf-8')) as {
            cookies?: Array<{ name: string, value: string }>
        }

        const orangeHrmCookie = authState.cookies?.find(cookie => cookie.name == 'orangehrm')
        expect(orangeHrmCookie, 'The orangehrm cookie was not found in the saved auth state').toBeTruthy()

        const cookieHeader = `orangehrm=${orangeHrmCookie?.value}`
        const password = 'Password*123'
        
        const response = await request.post(
            'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users',
            {
                headers: {
                    Cookie: cookieHeader,
                    Accept: 'application/json'
                },
                data: {"username":"Admin","password":password,"status":true,"userRoleId":1,"empNumber":3}
            }
        )

        expect(response.ok()).toBeFalsy()
        expect(response.status()).toBe(422) 

        const bodyJson = await response.json()
        console.log('Error response:', JSON.stringify(await bodyJson))
    });

    test('API - Get all users with invalid cookie should return Unauthorized', async ({ request }) => {

        // Arrange
        const invalidCookie = 'orangehrm=invalid-session-token-123456789';

        // Act
        const response = await request.get(
            'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users?limit=50&offset=0&sortField=u.userName&sortOrder=ASC',
            {
                headers: {
                    Cookie: invalidCookie,
                    Accept: 'application/json'
                }
            }
        );

        // Assert
        expect(response.status()).toBe(401);

        const body = await response.text();
        console.log(body);
    });

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

    test('Add new valid Admin user @admin ', async ({ page }) => {
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

    test('Add new Admin user with invalid password @admin', async ({ page }) => {
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

    test('Add new valid ESS user @ess', async ({ page }) => {
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

    test('Add new disabled Admin user @admin', async ({ page }) => {
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

    test('Add new disabled ESS user @ess', async ({ page }) => {
        // Arrange
        const navigate = new Navigate(page)
        const addNewUserPage = new AddNewUserPage(page)
        const usersTable = new UsersTable(page)

        // Act
        await navigate.toUser()
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

    test('Delete user admin @admin', async ({ page }) => {
        // Arrange
        const navigate = new Navigate(page)
        const addNewUserPage = new AddNewUserPage(page)
        const usersTable = new UsersTable(page)

        await navigate.toUser()
        await usersTable.editFirstAdminOnTheTable()
        const fullUserToSearch = await addNewUserPage.getEmployeeName()
        const AdminUser = UserFactory.createAdminUser({
            employeeName: fullUserToSearch
        });
        await page.goBack()
        await addNewUserPage.createUser(AdminUser)
        await addNewUserPage.expectUserCreated()

        // Act
        await usersTable.clickOnDeleteActionByUsername(AdminUser.username)
        await usersTable.acceptDeleteUser()

        //Assert
        await addNewUserPage.expectUserDeleted()
        await expect
            .poll(async () => await usersTable.getAllUsernames())
            .not.toContain(AdminUser.username);
    })

    test('Should not delete user when deletion is cancelled', async ({ page }) => {
        // Arrange
        const navigate = new Navigate(page)
        const addNewUserPage = new AddNewUserPage(page)
        const usersTable = new UsersTable(page)

        await navigate.toUser()
        await usersTable.editFirstAdminOnTheTable()
        const fullUserToSearch = await addNewUserPage.getEmployeeName()
        const AdminUser = UserFactory.createAdminUser({
            employeeName: fullUserToSearch
        });
        await page.goBack()
        await addNewUserPage.createUser(AdminUser)
        await addNewUserPage.expectUserCreated()

        // Act
        await usersTable.clickOnDeleteActionByUsername(AdminUser.username)
        await usersTable.NotAcceptDeleteUser()

        //Assert
        await expect
            .poll(async () => await usersTable.getAllUsernames())
            .toContain(AdminUser.username);
    })

})
