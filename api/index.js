const puppeteer = require('puppeteer')
const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)
require('dotenv').config()

const {FB_USER, FB_PASS} = process.env

const city = 'vancouver'

const facebookLogin = async (page) => {
  const FB_PAGE = {
    loginField: '#email',
    passField: '#pass',
    loginButton: '#loginbutton',
  }
  // Seems to wait til the entire fb page loads
  await page.goto('https://facebook.com', {
    waitUntil: 'networkidle2'
  })
  await page.waitForSelector(FB_PAGE.loginField)
  await page.type(FB_PAGE.loginField, FB_USER)
  await page.type(FB_PAGE.passField, FB_PASS)
  await page.click(FB_PAGE.loginButton)
  await page.waitForNavigation()
}

const skipTheDishesLogin = async page => {
  await page.goto('https://www.skipthedishes.com/user/login')
  await page.waitForSelector('.btn-facebook')
  await page.click('.btn-facebook')
  // await page.waitForNavigation()
}

const goToRestaurantPage = async page => {
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
}

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Login to Facebook account
  await facebookLogin(page)

  // Go to skip the dishes and login with facebook
  await skipTheDishesLogin(page)

  // Go to Vancouver SKD page and get a restaurant thats open
  // await goToRestaurantPage(page)
  
  // Take a screenshot
  await page.screenshot({path: './screenshot.png'})
  
  await browser.close()
})()
