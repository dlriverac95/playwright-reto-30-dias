import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/LoginPage';
import { SideMenuOption, SidePanel } from '../components/SidePanel';

test.describe('HRM Login Tests', () => {
    test('Login to HRM as a admin', async ({ page }) => {
        await page.goto('/web/index.php/dashboard/index')

        const sidePanel = new SidePanel(page)
        await sidePanel.clickOnOption(SideMenuOption.ADMIN)
        await sidePanel.clickOnOption(SideMenuOption.BUZZ)
        await sidePanel.clickOnOption(SideMenuOption.DASHBOARD)

        await sidePanel.searchAnOption(SideMenuOption.ADMIN)
        await expect(sidePanel.listOptions(SideMenuOption.ADMIN)).toBeVisible()
    })

    test('Login to HRM as a ESS', async ({ page }) => {
        await page.goto('/web/index.php/dashboard/index')

        const sidePanel = new SidePanel(page)
        await expect(page.getByRole('link', { name: 'Admin' })).not.toBeVisible()
        await sidePanel.clickOnOption(SideMenuOption.BUZZ)
        await sidePanel.clickOnOption(SideMenuOption.DASHBOARD)
    })

    // Negative test cases
    test('Login to HRM without username', async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.doLogin('', 'admin123')
        await expect(page.getByText('Required')).toBeVisible();
    })

    test('Login to HRM without password', async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.doLogin('Admin', '')
        await expect(page.getByText('Required')).toBeVisible();
    })

    test('Login to HRM with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.doLogin('AdminFacho', 'Fachio23')

        await expect(page.getByText('Invalid credentials')).toBeVisible();
    })
})