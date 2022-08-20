const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8383;
var bodyParser = require("body-parser");
const { response } = require("express");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
const fs = require("fs");
const cron = require("node-cron");

app.use(express.static("OCR-App/frontend/"));
app.use(bodyParser.json());
app.use(urlEncodedParser);
app.use(cors());

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});

app.post("/crawl", urlEncodedParser, async(req, res) => {
    await console.log(req.body.name);
    const result = await scrapeWithName(req.body.name);
    const myJSON = await JSON.parse(result);
    console.log(myJSON);

    res.status(200).send(myJSON);
});

app.get("/getnames", urlEncodedParser, async(req, res) => {
    // const names = await scrapeNameSpalte();
    let names;
    try {
        names = require("../ressources/wisostaff.json");
    } catch (err) {}

    res.status(200).send(names);
});

app.post("/getinfo", urlEncodedParser, async(req, res) => {
    await console.log("Received POST request with name " + req.body.name);
    await console.log("AND " + req.body);
    const result = await scrapeWithName(req.body.name);
    res.status(200).send(result);
});

/**
 * cronjob that gets all names of people working at wiso once a day to improve performace
 * by not loading them every single time the website is opened
 */
cron.schedule('0 2 * * *', async() => {
    await scrapeNameSpalte();
    console.log("CRONJOB SUCCESS");
})


let scrapeNamespalteResults = [];

/**
 * gets all names of people working at wiso
 * @returns {Promise<*[]>}
 */
const scrapeNameSpalte = async() => {
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

    // click on Personen und Einrichtungen
    const elements1 = await page.$x(
        "/html/body/form/table/tbody/tr[4]/td[2]/table/tbody/tr[1]/td/table/tbody/tr/td[2]/table[1]/tbody/tr/td/table/tbody/tr[3]/td[2]/font/p[1]/a"
    );
    await elements1[0].click();
    await page.waitForTimeout(450);

    // click on Rechts- und Wirtschaftswissenschaftliche Fakultaet
    const elements2 = await page.$x(
        "/html/body/form/table/tbody/tr[4]/td[2]/table/tbody/tr[1]/td/ul/li[6]/a"
    );
    await elements2[0].click();
    await page.waitForTimeout(450);

    // click on Fachbereich Wirtschafts- und Sozialwissenschaften
    const elements3 = await page.$x(
        "/html/body/form/table/tbody/tr[4]/td[2]/table/tbody/tr[2]/td/ul/li[4]/a"
    );
    await elements3[0].click();
    await page.waitForTimeout(450);

    const Einrichtungen = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > ul > li > a"
            )
        ).map((x) => x.href);
    });
    //console.log(Einrichtungen.length);
    for (i = 0; i < Einrichtungen.length; i++) {
        data(Einrichtungen[i]);
        await page.waitForTimeout(450);
    }
    // Merge subarrays in array to one array
    var merged = [].concat.apply([], scrapeNamespalteResults);
    //Delete duplicates
    let uniqueArray = merged.filter(function(item, pos) {
        return merged.indexOf(item) == pos;
    });
    console.log(uniqueArray.length);
    browser.close();
    //Bring Names in right order
    for (j = 0; j < uniqueArray.length; j++) {
        str1 = uniqueArray[j].split(", ")[0];
        str2 = uniqueArray[j].split(", ")[1];
        str3 = str2 + " " + str1;
        uniqueArray[j] = str3;
    }
    console.log(uniqueArray.length);
    console.log(uniqueArray);
    let uniqueArrayAsJson = await JSON.stringify(uniqueArray);
    fs.writeFile("OCR-App/ressources/wisostaff.json", uniqueArrayAsJson, 'utf8', () => {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        })
        //return uniqueArray;
};




/**
 * Gets name list from all people working at specific Lehrstuhl
 * @param link -> link to lehrstuhl
 * @returns {Promise<void>}
 */
const data = async(link) => {
    // Click on Link for Institution
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

    // Save persons from institution and store it in results array
    const persons = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > dl > dd > a"
            )
        ).map((x) => x.textContent);
    });
    scrapeNamespalteResults.push(persons);
    browser.close();
};


/**
 * scrapes univis for data about a scientific worker
 * @param name -> name of the person
 * @returns {Promise<string>}
 */
const scrapeWithName = async(name) => {
    // Save Data in array

    var personarr = [];
    var lehrstuhlpersonal = [];
    var lehrveranstaltungen = [];
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
    await page.waitForTimeout(450);
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
    await page.waitForTimeout(450);

    //TODO Methode benutzen um Links zu sammeln
    const links = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a"
            )
        ).map((x) => x.href);
    });
    console.log(links);
    const asyncGetLehrstuhl = async() => {
        let res = [];
        for (i = 0; i < links.length; i++) {
            let x = await getLehrstuhlData(links[i], i);
            res.push(x);
            //console.log(x);
        }
        let returnarr = [];
        for (i = 0; i < res[0].length; i++) {
            returnarr.push(res[0][i]);
        }
        return returnarr;
    }
    let getLehrstuhlDataResults = await asyncGetLehrstuhl();
    //console.log(getLehrstuhlDataResults)
    getLehrstuhlDataResultsArr = []

    browser.close();
    const returnObj1 = {}
    for (i = 0; i < getLehrstuhlDataResults.length; i++) {
        returnObj1[i] = getLehrstuhlDataResults[i];
    }

    return JSON.stringify(returnObj1);
};

let getLehrstuhlDataResultsArr = [];

/**
 * crawls for all the info about 1 - n Lehrstuehle
 * @param link
 * @returns {Promise<*[]>}
 */
const getLehrstuhlData = async(link) => {

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
    await page.waitForTimeout(450);

    // Save Personal Data in array
    const personarr = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > p > table > tbody > tr"
            )
        ).map((x) => x.outerHTML.slice(0, 3) + "target='_blank'" + x.outerHTML.slice(3, 9) + 'https://univis.fau.de/' + x.outerHTML.slice(9));
    });
    getLehrstuhlDataResultsArr.push(personarr);

    // Click on Institution to get more information
    const elements4 = await page.$x(
        "/html/body/form/table/tbody/tr[4]/td[2]/table/tbody/tr[1]/td/p/table/tbody/tr[last()]/td[last()]/a[last()]"
    );
    await elements4[0].click();
    await page.waitForTimeout(450);

    // Get other workers information
    const lehrstuhlpersonal = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > b > font , body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > a"
            )
        ).map((x) => x.outerHTML.slice(0, 3) + "target='_blank'" + x.outerHTML.slice(3, 9) + 'https://univis.fau.de/' + x.outerHTML.slice(9));
    });
    getLehrstuhlDataResultsArr.push(lehrstuhlpersonal);

    // Go to Lehrveranstaltungen and get all information from Lehrveranstaltung
    const elements5 = await page.$x(
        "/html/body/form/table/tbody/tr[2]/td/table/tbody/tr[3]/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td[3]/font/a"
    );
    await elements5[0].click();
    await page.waitForTimeout(450);

    // Get all Lehrveranstaltungen
    const lehrveranstaltungen = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > h4 > a"
            )
        ).map((y) => y.outerHTML.slice(0, 3) + "target='_blank'" + y.outerHTML.slice(3, 9) + 'https://univis.fau.de/' + y.outerHTML.slice(9));
    });

    getLehrstuhlDataResultsArr.push(lehrveranstaltungen);
    browser.close();
    console.log(getLehrstuhlDataResultsArr)
    console.log(getLehrstuhlDataResultsArr.length + " laenge")
    return getLehrstuhlDataResultsArr;

};