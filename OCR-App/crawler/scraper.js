const puppeteer = require("puppeteer");

const scrapeWithName = async(name) => {
    // Starting Page
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
    const page = await browser.newPage();
    await page.goto("https://univis.fau.de/form#remembertarget");

    //Click on page to come to person search
    const elements1 = await page.$x(
        "/html/body/form/table/tbody/tr[2]/td/table/tbody/tr[2]/td[4]/table[2]/tbody/tr[1]/td[2]/table/tbody/tr/td[1]/font/input[2]"
    );
    await elements1[0].click();
    await page.waitForTimeout(1 * 1000);

    // Search for person given as a variable and enter
    let VARIABLE = name;
    await page.$eval(
        'input[name="what"]',
        (el, value) => (el.value = value),
        VARIABLE
    );
    const elements2 = await page.$x(
        "/html/body/form/table/tbody/tr[4]/td[2]/table/tbody/tr[1]/td/input[3]"
    );
    await elements2[0].click();
    await page.waitForTimeout(1 * 1000);

    // Save person data from first page

    const personarrsmall = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > a"
            )
        ).map((x) => x.textContent);
    });

    const links = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a"
            )
        ).map((x) => x.href);
    });
    let i;
    for (i = 0; i < links.length; i++) {
        getLehrstuhlData(links[i], i);
    }

    browser.close();
};

// var results = [];

const getLehrstuhlData = async(link) => {
    var results = [];

    // Click on persons data
    // Starting Page
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
    const page = await browser.newPage();
    await page.goto(link);

    await page.waitForTimeout(1 * 1000);

    // Save Personal Data in array

    const personarr = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > p > table > tbody > tr"
            )
        ).map((x) => x.textContent);
    });

    results.push(personarr);

    // Click on Institution to get more information

    const elements4 = await page.$x(
        "/html/body/form/table/tbody/tr[4]/td[2]/table/tbody/tr[1]/td/p/table/tbody/tr[last()]/td[last()]/a[last()]"
    );
    await elements4[0].click();
    await page.waitForTimeout(1 * 1000);

    // Get other workers information

    const lehrstuhlpersonal = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > b > font , body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > a"
            )
        ).map((x) => x.textContent);
    });

    results.push(lehrstuhlpersonal);

    // Go to Lehrveranstaltungen and get all information from Lehrveranstaltung

    const elements5 = await page.$x(
        "/html/body/form/table/tbody/tr[2]/td/table/tbody/tr[3]/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td[3]/font/a"
    );
    await elements5[0].click();
    await page.waitForTimeout(1 * 1000);

    // Get all Lehrveranstaltungen

    const lehrverstantaltungen = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > h4 > a"
            )
        ).map((y) => y.textContent);
    });

    results.push(lehrverstantaltungen);

    //console.log(personarr)
    //console.log(lehrstuhlpersonal)
    //console.log(lehrverstantaltungen)

    console.log(results);
    console.log(results.length);

    browser.close();
    return results;
};

// scrapeWithName("Andreas Falke");
//module.exports = { scrapeWithName }