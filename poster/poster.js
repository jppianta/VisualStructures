const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/poster.html');
  await page.pdf({path: 'test.pdf', format: 'A4'});

  await browser.close();
})();