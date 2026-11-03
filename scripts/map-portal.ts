import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Autonomous Portal Mapper Script for NSU RDS
 * Usage: npx ts-node scripts/map-portal.ts (or via npm run map:portal)
 */
async function mapPortal() {
  const authFile = path.join(__dirname, '../playwright/.auth/student.json');
  if (!fs.existsSync(authFile)) {
    console.error('No cached session found at playwright/.auth/student.json. Run a test first to authenticate.');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: authFile });
  const page = await context.newPage();

  console.log('Navigating to landing dashboard...');
  await page.goto('http://10.102.11.254/rds/students/landing');
  await page.waitForLoadState('domcontentloaded');

  const menuItems = await page.evaluate(() => {
    const items: Array<{ section: string; name: string; url: string }> = [];
    const navLists = document.querySelectorAll('.nav.nav-list, ul.nav, #sidebar ul');
    navLists.forEach((list) => {
      const topItems = list.querySelectorAll(':scope > li');
      topItems.forEach((li) => {
        const topLink = li.querySelector(':scope > a');
        if (!topLink) return;
        const sectionName = (topLink.textContent || '').replace(/\s+/g, ' ').trim();
        const topHref = topLink.getAttribute('href') || '';

        const subLinks = li.querySelectorAll('ul.submenu li a, ul.dropdown-menu li a');
        if (subLinks.length > 0) {
          subLinks.forEach((sub) => {
            const subName = (sub.textContent || '').replace(/\s+/g, ' ').trim();
            const subHref = sub.getAttribute('href') || '';
            if (subHref && !subHref.startsWith('#') && !subHref.endsWith('.pdf') && !subHref.toLowerCase().includes('logout')) {
              items.push({ section: sectionName, name: subName, url: subHref });
            }
          });
        } else if (topHref && !topHref.startsWith('#') && !topHref.endsWith('.pdf') && !topHref.toLowerCase().includes('logout')) {
          items.push({ section: sectionName, name: sectionName, url: topHref });
        }
      });
    });
    return items;
  });

  console.log(`Discovered ${menuItems.length} routes in portal navigation.`);
  await browser.close();
}

if (require.main === module) {
  mapPortal().catch(console.error);
}

