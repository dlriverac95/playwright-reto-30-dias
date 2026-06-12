import { test, expect } from '@playwright/test';


test.describe('HRM users table', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
        await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
        await page.getByRole('button', { name: 'Login' }).click()
        await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()
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
});