const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const users = [
    { u: '2512570', p: '123' },
    { u: '2421354', p: '123' },
    { u: '2231451', p: '123' },
    { u: '2421226', p: '123' },
    { u: '2425471', p: '123' }
  ];
  for (const user of users) {
    try {
      await page.goto('http://10.102.11.254/rds_live_php84/');
      await page.locator('#UserName').fill(user.u);
      await page.locator('button[type="submit"][name="commit"]').click();
      await page.waitForTimeout(1000);
      const pwdVisible = await page.locator('#password').isVisible();
      if (!pwdVisible) {
        console.log(user.u, 'Next step failed, URL:', page.url());
        continue;
      }
      await page.locator('#password').fill(user.p);
      await page.locator('#login-submit-btn').click();
      await page.waitForTimeout(2000);
      const alert = await page.locator('.alert').innerText().catch(() => '');
      console.log(user.u, 'URL:', page.url(), 'Alert:', alert.trim().replace(/\s+/g, ' '));
      
      // If landed, try navigating to students/advising
      if (page.url().includes('students/landing')) {
        await page.goto('http://10.102.11.254/rds_live_php84/students/advising');
        await page.waitForTimeout(2000);
        console.log(user.u, 'Advising URL:', page.url(), 'Title:', await page.title());
        // Logout
        await page.goto('http://10.102.11.254/rds_live_php84/students/logout').catch(() => {});
      }
    } catch (e) {
      console.log(user.u, 'Error:', e.message);
    }
  }
  await browser.close();
})();
