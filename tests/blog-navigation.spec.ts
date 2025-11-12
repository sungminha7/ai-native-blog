import { test, expect } from '@playwright/test';

test.describe('Blog Navigation E2E Tests', () => {
  test('홈페이지 접속 및 기본 요소 확인', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    // 페이지 제목 확인
    await expect(page.locator('h1')).toHaveText('My Portfolio');

    // 페이지 설명 텍스트 확인
    await expect(page.locator('p').first()).toContainText("I'm a Vim enthusiast");

    // 블로그 포스트 링크가 존재하는지 확인 (최소 1개 이상)
    const blogLinks = page.locator('a[href^="/blog/"]');
    await expect(blogLinks.first()).toBeVisible();

    // 블로그 포스트 개수 확인 (최소 1개 이상)
    const count = await blogLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('블로그 목록 페이지에서 포스트 확인', async ({ page }) => {
    // 블로그 목록 페이지로 이동
    await page.goto('/blog');

    // 페이지 제목 확인
    await expect(page.locator('h1')).toHaveText('My Blog');

    // 블로그 포스트 링크가 존재하는지 확인
    const blogLinks = page.locator('a[href^="/blog/"]');
    await expect(blogLinks.first()).toBeVisible();

    // 각 블로그 포스트에 제목과 날짜가 표시되는지 확인
    const firstPost = blogLinks.first();
    await expect(firstPost).toBeVisible();

    // 블로그 포스트 제목 텍스트 확인
    const titleText = await firstPost.locator('p.text-neutral-900').textContent();
    expect(titleText).toBeTruthy();
    expect(titleText!.length).toBeGreaterThan(0);

    // 날짜 텍스트 확인
    const dateText = await firstPost.locator('p.text-neutral-600').textContent();
    expect(dateText).toBeTruthy();
  });

  test('개별 블로그 포스트 페이지 접근 및 콘텐츠 확인', async ({ page }) => {
    // 블로그 목록 페이지로 이동
    await page.goto('/blog');

    // 첫 번째 블로그 포스트의 제목 저장
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    const expectedTitle = await firstPostLink.locator('p.text-neutral-900').textContent();

    // 첫 번째 블로그 포스트 클릭
    await firstPostLink.click();

    // URL이 /blog/[slug] 형식인지 확인
    await page.waitForURL(/\/blog\/[^/]+$/);
    expect(page.url()).toMatch(/\/blog\/[^/]+$/);

    // 포스트 제목 확인 (h1.title)
    const postTitle = page.locator('h1.title');
    await expect(postTitle).toBeVisible();

    // 제목이 블로그 목록에서 본 것과 일치하는지 확인
    await expect(postTitle).toHaveText(expectedTitle!.trim());

    // 게시 날짜 확인
    const publishDate = page.locator('p.text-neutral-600').first();
    await expect(publishDate).toBeVisible();

    // 블로그 콘텐츠 (article.prose) 확인
    const articleContent = page.locator('article.prose');
    await expect(articleContent).toBeVisible();

    // article에 실제 콘텐츠가 있는지 확인
    const contentText = await articleContent.textContent();
    expect(contentText).toBeTruthy();
    expect(contentText!.length).toBeGreaterThan(0);
  });

  test('블로그 포스트 간 네비게이션', async ({ page }) => {
    // 블로그 목록 페이지로 이동
    await page.goto('/blog');

    // 블로그 포스트가 여러 개 있는지 확인
    const blogLinks = page.locator('a[href^="/blog/"]');
    const postCount = await blogLinks.count();

    if (postCount > 1) {
      // 첫 번째 포스트 클릭
      await blogLinks.first().click();
      await page.waitForURL(/\/blog\/[^/]+$/);
      const firstPostUrl = page.url();

      // 뒤로 가기
      await page.goBack();
      await expect(page).toHaveURL('/blog');

      // 두 번째 포스트 클릭
      await blogLinks.nth(1).click();
      await page.waitForURL(/\/blog\/[^/]+$/);
      const secondPostUrl = page.url();

      // 두 포스트의 URL이 다른지 확인
      expect(firstPostUrl).not.toBe(secondPostUrl);
    }
  });

  test('홈페이지에서 블로그 포스트로 직접 접근', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    // 첫 번째 블로그 포스트 링크 클릭
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    // 블로그 포스트 페이지로 이동했는지 확인
    await page.waitForURL(/\/blog\/[^/]+$/);

    // 포스트 콘텐츠 확인
    const postTitle = page.locator('h1.title');
    await expect(postTitle).toBeVisible();

    const articleContent = page.locator('article.prose');
    await expect(articleContent).toBeVisible();
  });
});
