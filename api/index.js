const puppeteer = require('puppeteer')
const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)
require('dotenv').config()

const {FB_USER, FB_PASS, STD_USER, STD_PASS} = process.env

const headless = false
const city = 'vancouver'
const waitUntilIdle = {waitUntil: 'networkidle0'}

const facebookLogin = async page => {
  const FB_PAGE = {
    loginField: '#email',
    passField: '#pass',
    loginButton: '#loginbutton',
  }
  console.log('logging inna facebook')
  // Seems to wait til the entire fb page loads
  await page.goto('https://facebook.com', {
    waitUntil: 'networkidle2'
  })
  await page.waitForSelector(FB_PAGE.loginField)
  await page.type(FB_PAGE.loginField, FB_USER)
  await page.type(FB_PAGE.passField, FB_PASS)
  await page.click(FB_PAGE.loginButton)
  await page.waitForNavigation()
  console.log('logged inna facebook')
}

const skipTheDishesLoginFb = async page => {
  const STD_PAGE = {
    loginButton: 'button:nth-child(3) div',
    loginButton2: 'div > ul > div',
    facebookButton: 'body > div > div > div > div > div > div > div:nth-child(1) > div > button',
    facebookButton2: '#u_0_4 > div > div- > div > button',
  }
  console.log('logging inna facebook sso on std')
  await page.goto('https://www.skipthedishes.com/', waitUntilIdle)
  await page.waitForSelector(STD_PAGE.loginButton)
  await page.click(STD_PAGE.loginButton)
  console.log('clicked login button')
  await page.waitFor(1000)
  await page.waitForSelector(STD_PAGE.loginButton2)
  console.log('clicking second login button')
  await page.click(STD_PAGE.loginButton2)
  await page.waitForSelector(STD_PAGE.facebookButton)
  await page.click(STD_PAGE.facebookButton)
  console.log('logged inna facebook sso on std')
  await page.waitForNavigation()
  await page.click(STD_PAGE.facebookButton2)
}

const skipTheDishesLogin = async page => {
  const STD_PAGE = {
    loginField: '#email',
    passField: '#password',
    loginButton: '#submit-btn',
  }
  await page.goto('https://www.skipthedishes.com/user/login')
  await page.waitForSelector(STD_PAGE.loginField)
  await page.type(STD_PAGE.loginField, STD_USER)
  await page.type(STD_PAGE.passField, STD_PASS)
  await page.click(STD_PAGE.loginButton)
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
  const browser = await puppeteer.launch({headless})
  const page = await browser.newPage()

  // Login to Facebook account
  await facebookLogin(page)

  // Go to skip the dishes and login with facebook
  await skipTheDishesLoginFb(page)

  // Login with SkipTheDishes username/password - broken because their login page doesnt exist anymore!
  // await skipTheDishesLogin(page)
  // await page.waitFor(4000)

  // Go to Vancouver SKD page and get a restaurant thats open
  await goToRestaurantPage(page)
  await page.waitFor(4000)

  // Take a screenshot
  await page.screenshot({path: './screenshot.png'})
  console.log('created screenshot.')
  console.log('ended on page:', page.url())

  await browser.close()
})()
