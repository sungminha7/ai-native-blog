import { test, expect } from '@playwright/test';

test.describe('다크모드 기능 E2E 테스트', () => {
  test('다크모드 토글 버튼이 존재하는지 확인', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    // 다크모드 토글 버튼이 존재하는지 확인
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();
  });

  test('다크모드 토글 기능 테스트', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    // html 요소의 class 확인
    const htmlElement = page.locator('html');

    // 다크모드 토글 버튼 찾기
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();

    // 초기 테마 확인 (시스템 설정에 따라 다를 수 있음)
    const initialClass = await htmlElement.getAttribute('class');

    // 토글 버튼 클릭
    await themeToggle.click();

    // 잠시 대기 (테마 전환 시간)
    await page.waitForTimeout(100);

    // 클릭 후 class가 변경되었는지 확인
    const afterClickClass = await htmlElement.getAttribute('class');

    // 다시 토글 버튼 클릭
    await themeToggle.click();
    await page.waitForTimeout(100);

    // 다시 클릭 후 class 확인
    const finalClass = await htmlElement.getAttribute('class');

    // 토글이 정상적으로 작동하는지 확인
    expect(afterClickClass).not.toBe(initialClass);
  });

  test('다크모드 설정이 localStorage에 저장되는지 확인', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    const themeToggle = page.locator('button[aria-label="Toggle theme"]');

    // 토글 버튼 클릭
    await themeToggle.click();
    await page.waitForTimeout(200);

    // localStorage에 theme 설정이 저장되었는지 확인
    const storedTheme = await page.evaluate(() => {
      return localStorage.getItem('theme');
    });

    expect(storedTheme).toBeTruthy();
  });

  test('페이지 새로고침 후에도 다크모드 설정이 유지되는지 확인', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    const htmlElement = page.locator('html');

    // 다크모드로 전환
    await themeToggle.click();
    await page.waitForTimeout(200);

    // 페이지 새로고침
    await page.reload();
    await page.waitForTimeout(500);

    // 새로고침 후 class 확인
    const classAfterReload = await htmlElement.getAttribute('class');

    // 다크모드 설정이 유지되는지 확인
    expect(classAfterReload).toContain('dark');
  });

  test('다른 페이지로 이동해도 다크모드 설정이 유지되는지 확인', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    const htmlElement = page.locator('html');

    // 다크모드로 전환
    await themeToggle.click();
    await page.waitForTimeout(200);

    // 블로그 페이지로 이동
    await page.goto('/blog');
    await page.waitForTimeout(200);

    // 다크모드 설정이 유지되는지 확인
    const classAfterNavigation = await htmlElement.getAttribute('class');
    expect(classAfterNavigation).toContain('dark');
  });
});
