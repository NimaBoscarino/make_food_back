const puppeteer = require('puppeteer')
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.skipthedishes.com/vancouver/restaurants')

  const restaurants = await page.$$eval('a[data-restaurant-open="1"] .truncated-name', divs => {
    return divs.map(div => div.innerHTML)
  })
  restaurants.forEach(console.log)

  await browser.close()
})()
