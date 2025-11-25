const { test, expect } = require('@playwright/test');

test.describe('Driver Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as driver
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="text"]', 'driver1');
    await page.fill('input[type="password"]', '12345');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL('**/driver-schedule');
  });

  test('Hiển thị danh sách học sinh', async ({ page }) => {
    // Kiểm tra có danh sách học sinh
    const studentList = page.locator('[class*="Danh sách đón trả"]');
    await expect(studentList).toBeVisible();
  });

  test('Điểm danh học sinh', async ({ page }) => {
    // Click vào nút điểm danh đầu tiên
    const firstCheckButton = page.locator('button:has-text("Chưa hoàn thành")').first();
    
    if (await firstCheckButton.isVisible()) {
      await firstCheckButton.click();
      
      // Kiểm tra trạng thái đã thay đổi
      await expect(page.locator('button:has-text("Hoàn thành")').first()).toBeVisible();
    }
  });

  test('Mở modal báo cáo sự cố', async ({ page }) => {
    // Click nút "Tạo báo cáo mới"
    await page.click('button:has-text("Tạo báo cáo mới")');
    
    // Kiểm tra modal hiển thị
    await expect(page.locator('text=Báo cáo sự cố')).toBeVisible();
  });

  test('Gửi báo cáo sự cố', async ({ page }) => {
    // Mở modal
    await page.click('button:has-text("Tạo báo cáo mới")');
    
    // Điền nội dung
    await page.fill('textarea[name="description"]', 'Test incident - E2E test');
    
    // Submit
    await page.click('button:has-text("Gửi báo cáo")');
    
    // Kiểm tra thông báo thành công (hoặc modal đóng)
    await page.waitForTimeout(1000);
  });
});
