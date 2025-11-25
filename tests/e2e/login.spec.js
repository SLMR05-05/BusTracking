const { test, expect } = require('@playwright/test');

test.describe('Login Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
  });

  test('Đăng nhập thành công với tài khoản admin', async ({ page }) => {
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '12345');
    await page.click('button[type="submit"]');

    // Chờ redirect đến dashboard
    await page.waitForURL('**/dashboard');
    
    // Kiểm tra có hiển thị trang dashboard
    await expect(page.locator('h1')).toContainText('Tổng quan');
  });

  test('Đăng nhập thất bại với mật khẩu sai', async ({ page }) => {
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Kiểm tra hiển thị thông báo lỗi
    await expect(page.locator('.bg-red-50')).toBeVisible();
  });

  test('Không thể submit form khi thiếu thông tin', async ({ page }) => {
    await page.fill('input[type="text"]', 'admin');
    // Không điền password
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });
});
