import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.failure().errorText, request.url())
  );

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Wait for React to load
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Clicking Keuangan...');
  try {
    const handles = await page.$$('text/Keuangan');
    for (const h of handles) {
       await h.click();
    }
    
    // Check if Laporan Keuangan exists and click it
    const handles2 = await page.$$('text/Laporan Keuangan');
    for (const h of handles2) {
       await h.click();
    }
  } catch (e) {
    console.log('Click error:', e);
  }

  await new Promise(r => setTimeout(r, 3000));

  await browser.close();
})();
