const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    page.setViewport({
      width: 775,
      height: 910
    });
    await page.addStyleTag({
      url: 'https://fonts.googleapis.com/css?family=Muli'
    });
    await page.addStyleTag({
      path: './poster.css'
    });
    await page.goto('http://localhost:8080/poster.html');
    await page.screenshot({path: 'example.jpg', type: 'jpeg', quality: 100});
  
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();