import {test as setup, expect} from '@playwright/test';
import { LoginPage } from '../pageobjects/loginPage';

setup('authentication as Admin', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    // Verify that the login was successful by checking for an element that is only visible after login
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible() 

    //Safe the state of the page after login to reuse it in other tests
    await page.context().storageState({ path: '.auth/admin.json' })

    console.log('Authentication completed and state saved.')
})
/*
setup('authentication as Employee', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.loginAsEss()

    // Verify that the login was successful by checking for an element that is only visible after login
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible() 

    //Safe the state of the page after login to reuse it in other tests
    await page.context().storageState({ path: '.auth/employee.json' })

    console.log('Authentication completed and state saved.')
})
*/