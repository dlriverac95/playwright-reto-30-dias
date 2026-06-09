import {test, expect} from '@playwright/test';

test('Login to HRM', async ({page}) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByRole ('textbox', {name: 'Username'}).fill('Admin');
    await page.getByRole ('textbox', {name: 'Password'}).fill('admin123');
    await page.getByRole('button', {name: 'Login'}).click();

    await expect(page.getByRole('link', {name: 'Admin'})).toBeVisible();    
})

// Negative test cases
test('Login to HRM without username', async ({page}) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByRole('button', {name: 'Login'}).click();
    await page.getByRole ('textbox', {name: 'Password'}).fill('admin123');

    await expect(page.getByText('Required')).toBeVisible();
})

test('Login to HRM without password', async ({page}) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByRole('button', {name: 'Login'}).click();
    await page.getByRole ('textbox', {name: 'Username'}).fill('Admin');

    await expect(page.getByText('Required')).toBeVisible();
})

test('Login to HRM with invalid credentials', async ({page}) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByRole('button', {name: 'Login'}).click();
    await page.getByRole ('textbox', {name: 'Username'}).fill('Admin');
    await page.getByRole ('textbox', {name: 'Password'}).fill('admin1234'); 

    await expect(page.getByText('Invalid credentials')).toBeVisible();
})