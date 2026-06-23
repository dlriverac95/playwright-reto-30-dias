import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/loginPage';

test.describe('HRM Login Tests', () => {
    test('Login to HRM', async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.doLogin('Admin', 'admin123')
        await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

        await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
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