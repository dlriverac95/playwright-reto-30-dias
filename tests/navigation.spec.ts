import { test, expect } from '@playwright/test';

test.describe('HRM navigation bar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
        await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
        await page.getByRole('button', { name: 'Login' }).click()
        await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()
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
})