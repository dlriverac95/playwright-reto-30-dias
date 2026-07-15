import { Page, expect, Locator } from "@playwright/test";
import { UserModel } from "../models/UserModel";

export class AddNewUserPage {
    private readonly addButton: Locator;
    private readonly saveButton: Locator;

    private readonly userRoleDropdown: Locator;
    private readonly userStatusDropdown: Locator;

    private readonly employeeNameInput: Locator;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;

    private readonly confirmationMessage: Locator;
    private readonly confirmationPasswordErrorMessage: Locator;

    constructor(private readonly page: Page) {
        this.addButton = page.getByRole("button", { name: "Add" });
        this.saveButton = page.getByRole("button", { name: "Save" });
        this.confirmationMessage = page.locator("p.oxd-text--toast-message");
        this.confirmationPasswordErrorMessage = page.locator("span.oxd-input-field-error-message");

        this.userRoleDropdown = page.locator(
            "//label[contains(.,'User Role')]/parent::div/following-sibling::div"
        );

        this.userStatusDropdown = page
            .locator("div.oxd-grid-item--gutters")
            .filter({ has: page.getByText("Status") })
            .locator("div.oxd-select-text-input");

        this.employeeNameInput = page.getByRole("textbox", {
            name: "Type for hints...",
        });

        this.usernameInput = page
            .locator("div.oxd-grid-item--gutters")
            .filter({ has: page.getByText("Username") })
            .getByRole("textbox");

        this.passwordInput = page
            .locator("div.oxd-grid-item--gutters")
            .filter({ has: page.getByText("Password", { exact: true }) })
            .getByRole("textbox");

        this.confirmPasswordInput = page
            .locator("div.oxd-grid-item--gutters")
            .filter({ has: page.getByText("Confirm Password", { exact: true }) })
            .getByRole("textbox");
    }


    async clickAdd() {
        await this.addButton.click()
    }

    async selectUserRole(userRole: string) {
        await this.userRoleDropdown
            .click()
        await this.page.getByRole('listbox')
            .getByRole('option', { name: userRole })
            .click()
    }

    async fillEmployeeName(employeeName: string) {
        await this.employeeNameInput
            .fill(employeeName)
        await this.page.getByText(employeeName, { exact: true }).first()
            .click()
    }

    async selectUserStatus(userStatus: string) {
        await this.userStatusDropdown
            .click()
        await this.page.getByText(userStatus, { exact: true })
            .click()
    }

    async fillUsername(username: string) {
        await this.usernameInput.fill(username)
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password)
    }

    async fillConfirmPassword(confirmPassword: string) {
        await this.confirmPasswordInput.fill(confirmPassword)
    }

    async clickSave() {
        await this.saveButton.click()
    }

    async expectUserCreated() {
        await expect(this.confirmationMessage)
            .toHaveText('Successfully Saved')
    }

    async expectUserCreationFailed() {
        await expect(this.confirmationPasswordErrorMessage)
            .toHaveText('Passwords do not match')
    }

    async createUser(user: UserModel) {
        await this.clickAdd()
        await this.selectUserRole(user.role)
        await this.fillEmployeeName(user.employeeName)
        await this.selectUserStatus(user.status)
        await this.fillUsername(user.username)
        await this.fillPassword(user.password)
        await this.fillConfirmPassword(user.confirmPassword)
        await this.clickSave()
    }

    async getEmployeeName(): Promise<string>{
        const employeeInput = this.page.getByPlaceholder('Type for hints...')
        await expect(employeeInput).not.toHaveValue('')
        const fullUserToSearch = await employeeInput.inputValue()
        return fullUserToSearch
    }
}
