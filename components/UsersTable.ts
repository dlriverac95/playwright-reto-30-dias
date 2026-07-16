import { Locator, Page, expect } from '@playwright/test';

export class UsersTable {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    private getAllBodyRows(): Locator {
        return this.page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
    }

    getAdminRows(): Locator {
        return this.getAllBodyRows().filter({
            has: this.page.getByRole('cell', { name: 'Admin', exact: true })
        })
    }

    private async getFirstAdminFromTable(): Promise<Locator> {
        const firstAdminToSearch = this.getAdminRows().first()
        // toBeVisible es la aserción correcta para un elemento único (.first)
        await expect(firstAdminToSearch, "No admin users found in the table").toBeVisible()
        return firstAdminToSearch
    }

    async editFirstAdminOnTheTable() {
        const firstAdminToEdit = await this.getFirstAdminFromTable()
        await firstAdminToEdit.locator("button")
            .filter({ has: this.page.locator('i.bi-pencil-fill') }).click()
    }

    getESSRows(): Locator {
        return this.getAllBodyRows().filter({
            has: this.page.getByRole('cell', { name: 'ESS', exact: true })
        })
    }

    private async getFirstESSFromTable(): Promise<Locator> {
        const firstESSToSearch = this.getESSRows().first()
        await expect(firstESSToSearch, "No ESS users found in the table").toBeVisible()
        return firstESSToSearch
    }

    async editFirstESSOnTheTable() {
        const firstESSToEdit = await this.getFirstESSFromTable()
        await firstESSToEdit.locator("button")
            .filter({ has: this.page.locator('i.bi-pencil-fill') }).click()
    }

    async getAvailableUsernames(excludeUser = 'Admin'): Promise<string[]> {
        const rows = this.getAllBodyRows()
        const count = await rows.count()
        const usernames: string[] = []

        for (let i = 0; i < count; i++) {
            // La celda índice 1 suele ser la del Username en OrangeHRM
            const username = await rows.nth(i).getByRole('cell').nth(1).innerText()
            if (username !== excludeUser) {
                usernames.push(username)
            }
        }
        return usernames
    }

    async editUserByUsername(username: string) {
        const userRow = this.getAllBodyRows().filter({
            has: this.page.getByRole('cell', { name: username, exact: true })
        })

        await userRow.locator("button")
            .filter({ has: this.page.locator('i.bi-pencil-fill') })
            .click()
    }

    private async getColumnTexts(columnIndex: number): Promise<string[]> {
        const rows = this.getAllBodyRows()
        const count = await rows.count()
        const texts: string[] = []

        for (let i = 0; i < count; i++) {
            // Usamos nth(columnIndex) para apuntar a la columna deseada
            const text = await rows.nth(i).getByRole('cell').nth(columnIndex).textContent()

            // Verificamos que no sea nulo y quitamos espacios en blanco extra
            if (text && text.trim() !== '') {
                texts.push(text.trim())
            }
        }
        return texts
    }

    async getAllUsernames(): Promise<string[]> {
        return this.getColumnTexts(1) // Índice 1 es Username
    }

    async getAllEmployeeNames(): Promise<string[]> {
        return this.getColumnTexts(3) // Índice 3 es Employee Name
    }

    async clickOnDeleteActionByUsername(username: string) {
        const allBodyRows = this.getAllBodyRows()
        const filteredRowsByUsername = allBodyRows.filter({
            has: this.page.getByRole('cell', { name: username, exact: true })
        })

        expect(filteredRowsByUsername, `No user found with username: ${username}`).toHaveCount(1)

        await filteredRowsByUsername
            .locator("button")
            .filter({ has: this.page.locator('i.bi-trash') })
            .click()
    }

    async acceptDeleteUser() {
        await this.page.getByRole('button', { name: /Yes, Delete/ }).click()
    }

    async NotAcceptDeleteUser() {
        await this.page.getByRole('button', { name: /No, Cancel/ }).click()
    }

}
