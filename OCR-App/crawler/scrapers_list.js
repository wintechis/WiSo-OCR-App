const puppeteer = require("puppeteer");
var results = [];

const data = async(link) => {
    // Click on Link for Institution
    // Starting Page
    const browser = await puppeteer.launch({ headless: true });
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
    results.push(persons);

    browser.close();
};

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
    await page.waitForTimeout(1000);

    // click on Rechts- und Wirtschaftswissenschaftliche Fakultaet
    const elements2 = await page.$x(
        "/html/body/form/table/tbody/tr[4]/td[2]/table/tbody/tr[1]/td/ul/li[6]/a"
    );
    await elements2[0].click();
    await page.waitForTimeout(1000);

    // click on Fachbereich Wirtschafts- und Sozialwissenschaften
    const elements3 = await page.$x(
        "/html/body/form/table/tbody/tr[4]/td[2]/table/tbody/tr[2]/td/ul/li[4]/a"
    );
    await elements3[0].click();
    await page.waitForTimeout(1000);

    const Einrichtungen = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                "body > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > ul > li > a"
            )
        ).map((x) => x.href);
    });

    //console.log(Einrichtungen.length);

    let i;
    for (i = 0; i < Einrichtungen.length; i++) {
        data(Einrichtungen[i]);
        await page.waitForTimeout(450);
    }

    // Merge subarrays in array to one array
    var merged = [].concat.apply([], results);

    //Delete duplicates
    let uniqueArray = merged.filter(function(item, pos) {
        return merged.indexOf(item) == pos;
    });
    console.log(uniqueArray.length);

    browser.close();

    //Bring Names in right order
    let j;
    let str1, str2, str3;
    for (j = 0; j < uniqueArray.length; j++) {
        str1 = uniqueArray[j].split(", ")[0];
        str2 = uniqueArray[j].split(", ")[1];

        str3 = str2 + " " + str1;

        uniqueArray[j] = str3;
    }
    console.log(uniqueArray.length);
    console.log(uniqueArray);

    return uniqueArray;
};

// scrapeNameSpalte();