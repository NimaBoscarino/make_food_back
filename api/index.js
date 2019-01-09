const puppeteer = require('puppeteer')
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

const city = 'vancouver'

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Log into Nima Boscarino's account
  await page.goto('https://www.skipthedishes.com/user/login')
  
  // TODO: log in

  // Go to Restaurants list for the city
  await page.goto('https://www.skipthedishes.com/' + city + '/restaurants')

  const restaurantNames = await page.$$eval('a[data-restaurant-open="1"] .truncated-name', divs => {
    return divs.map(div => div.innerHTML)
  })
  const restaurantUrls = await page.$$eval('a[data-restaurant-open="1"]', elements => {
    return elements.map(element => element.href)
  })
  const restaurantIndex = Math.floor(Math.random() * restaurantNames.length) + 1  

  console.log(restaurantNames[restaurantIndex])
  const url = restaurantUrls[restaurantIndex]
  console.log(url)
  
  // Let's go to this restaurant
  await page.goto(url)
  await page.click(".address-autocomplete-button")
  await page.screenshot({path: 'restaurantpage.png'})


  await browser.close()
})()
