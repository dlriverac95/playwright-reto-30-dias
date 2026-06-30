import { test, expect } from '@playwright/test';
import { SideMenuOption, SidePanel } from "../components/SidePanel";

test.describe('Claim section', () => {

    test('capture all amounts', async ({ page }) => {

        await page.goto('/web/index.php/dashboard/index')
        const sidePanel = new SidePanel(page)
        await sidePanel.clickOnOption(SideMenuOption.CLAIM)

        //Esperar carga de la tabla
        await expect(page.locator('.oxd-table-card').first()).toBeVisible()

        const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
        const amounts: number[] = []
        const rowCount = await allBodyRows.count()
        console.log('Number of row :', rowCount)

        for (let i = 0; i < rowCount; i++) {
            const amountCell = allBodyRows.nth(i).getByRole('cell').nth(7)
            const amountText = await amountCell.textContent()
            console.log("This is the amount in text: ", amountText)

            if (amountText === null) {
                continue
            }
            const convertedNumber = parseFloat(amountText?.replace(/,/g, '').trim())

            amounts.push(convertedNumber)
        }

        console.log(amounts)

        const total = amounts.reduce((sum, amount) => sum + amount, 0)
        const average = total / amounts.length
        const maxAmount = Math.max(...amounts)
        const minAmount = Math.min(...amounts)
        
        console.log('Total is: ', total)
        console.log('Average is: ', average)
        console.log('Max amount is: ', maxAmount)
        console.log('Min amount is: ', minAmount)
    })
})
