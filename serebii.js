const fs = require('fs');
const slugify = require('slugify');
const puppeteer = require('puppeteer');

const createFolder = (name) => {
    if (!fs.existsSync(name)){
        fs.mkdirSync(name);
        return 'Created!';
    }
    return 'Existed!';
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://www.serebii.net/swordshield/galarpokedex.shtml';
    await page.goto(url, { waitUntil: 'networkidle2' });
    createFolder('./serebii');
    await page.setViewport({ width: 1920, height: 1070 });
    await page.screenshot({path: './serebii/index.png', fullPage: true});
    console.log("Empezamos con Serebii");

    //let pkmns = page.$$('main>table.tab tr');
    let pkmns = await page.$$eval( 'main>table.tab', (pkmns) => {
        let tablas = pkmns[1];
        tablas = tablas.querySelectorAll('tr');
        pkmns = [];
        for (let j = 0; j < tablas.length; j++) {
            let celda = j !== 0 && j !== 1 ? tablas[j] : null ;
            if ( celda ){
                celda = celda.querySelectorAll('td') || null;
                let pkmn = {};
                for (let i = 0; i < celda.length; i++) {
                    const item = celda[i];
                    switch (i) {
                        case 0:
                            pkmn.no = item.innerText;
                            break;
                        case 1:
                            var images = '';
                            images = item.innerHTML.split('src=')[1];
                            images = images.split('"')[1];
                            pkmn.img = images;
                            break;
                        case 3:
                            pkmn.name = item.innerText.split('\n')[0];
                            pkmn.trueName = item.innerText.split('\n')[1];
                        case 4:
                            pkmn.abilities = item.innerText.split('\n');
                        case 5:
                            var types = '';
                            types = item.innerHTML.split('src=')[1];
                            types = types ? types.split('"')[1] : 'No Tengo';
                            pkmn.type = types;
                        case 6:
                            pkmn.hp = item.innerText;
                        case 7:
                            pkmn.attack = item.innerText;
                        case 8:
                            pkmn.defence = item.innerText;
                        case 9:
                            pkmn.special_attack = item.innerText;
                        case 10:
                            pkmn.special_defence = item.innerText;
                        case 11:
                            pkmn.speed = item.innerText;
                        default:
                            break;
                    }
                    //pkmn[i] = item.innerText;
                }
                pkmns.push(pkmn);
            }
        }
        return pkmns;
    });

    console.log('pokemon', pkmns);

    console.log('---< o >---');
    console.log('---< o >---');
    console.log('Terminado!');
    await browser.close();
})();