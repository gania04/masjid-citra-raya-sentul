const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('console', msg => {
    if(msg.type() === 'error') console.log('PAGE LOG ERROR:', msg.text());
  });
  
  console.log('Navigating to local dev server...');
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Waiting for login...');
  const loginBtn = await page.$('button.flex.items-center.gap-2.px-6.py-4');
  if (loginBtn) {
    console.log('Portal button found, clicking...');
    await loginBtn.click();
  } else {
    console.log('Trying login modal...');
    const headerLogin = await page.$('header button');
    if(headerLogin) await headerLogin.click();
    await new Promise(r => setTimeout(r, 1000));
    const adminBtn = await page.$('text/Login sebagai Admin');
    if(adminBtn) await adminBtn.click();
  }
  
  await new Promise(r => setTimeout(r, 2000));
  console.log('Looking for keuangan menu...');
  const menus = await page.$$('button');
  for(const btn of menus) {
    const text = await page.evaluate(el => el.textContent, btn);
    if(text && (text.includes('Keuangan') || text.includes('Modul Akuntansi') || text.includes('Laporan Keuangan'))) {
      console.log('Clicking finance module... text was:', text);
      await btn.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 3000));
  console.log('Done.');
  await browser.close();
})();
