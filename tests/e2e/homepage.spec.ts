import { test, expect } from '@playwright/test';

test.describe('ホームページ', () => {
  test('ページトップが正常に表示される', async ({ page }) => {
    await page.goto('/');
    
    // ページタイトルの確認（E2E用設定を反映）
    await expect(page).toHaveTitle(/E2Eテスト用ブログ/);
    
    // メインヘッダーの確認
    await expect(page.locator('h1')).toBeVisible();
    
    // ページが正常に読み込まれていることを確認
    await expect(page.locator('body')).toBeVisible();
  });
});