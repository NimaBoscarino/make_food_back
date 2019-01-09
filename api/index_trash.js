const puppeteer = require('puppeteer')
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
;(async () => {
  var input = 'input[name=address_display]'
  var delivery = '#btn-delivery'
  var address = 'Vancouver, BC, Canada'

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.skipthedishes.com/')
  // Add the address
  await page.$eval(input, el => {
    el.value = 'Vancouver, BC, Canada'
    console.log('document', document)
  });
  await setTimeoutPromise(1000)
  // Click delivery
  await page.click(delivery)
  
  // await page.click(delivery)
  // await setTimeoutPromise(5000)
  await page.screenshot({path: 'screenshot2.png'});

  await browser.close()
})()
