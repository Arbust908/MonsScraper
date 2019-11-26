const fs = require('fs');
const slugify = require('slugify');
const puppeteer = require('puppeteer');



(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://www.cpokemon.com/pokes/swsh/sprites/';
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    await page.setViewport({ width: 1920, height: 1070 });
    await page.screenshot({path: './'+'mons'+'.png', fullPage: true});
    console.log("Vamos a empezar")
    
    // let carpetas = await page.$$('#content ul#items>li.item.folder:not(.folder-parent)');
    // console.log(carpetas);

    let carpetas = await page.$$eval('ul#items>li.item.folder', async (carpetas) => {
        let things = [];
        console.log(carpetas);
        carpetas.forEach( async (carpeta) => {
            let name = carpeta.querySelector('span.label').innerText;
            let link = carpeta.querySelector('a').getAttribute('href');
            console.log(name, link);
            
            things.push({'nombre': name, 'rareza': rarity, 'link': link, 'imagen': img, 'imgName': imgName});
        });
        return things;
    });
    console.log(carpetas);
    
    for (const carpeta of carpetas) {
        console.log('Empiezo con ' + carpeta.name);
        
        let name = slugify(carpeta.name);
        
        let dir = './mon/' + name + '/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        // ir al link y bajar todas las imgs

        // var viewSource = await page.goto(carpeta.imagen);
        // await fs.writeFileSync(dir+carpeta.imgName, await viewSource.buffer());

        // var jsonContent = JSON.stringify(carpeta);
        // //console.log(jsonContent);
        // await fs.writeFileSync(dir + name +'.json', jsonContent, 'utf8');

        // console.log(url + carpeta.link);

        // await page.goto(url+carpeta.link);
        // let imagenes = await page.$$eval('div.WikiaArticle#WikiaArticle img', async (imgs) => {
        //     let downloads = [];
        //     imgs.forEach( async (img) => {
        //         let sorce = img.getAttribute('data-src');
        //         if (sorce === null) {
        //             sorce = img.getAttribute('srcset');
        //             sorce = sorce.split('.png');
        //             sorce = sorce[0]+'.png';
        //         }
        //         let imgName = img.getAttribute('data-image-name');
        //         downloads.push({'sorce': sorce, 'imgName': imgName});
        //     });
        //     return downloads;
        // });
        // // console.log(imagenes);
        
        // for (const img of imagenes) {
        //     console.log(img.sorce);
        //     // console.log(dir+img.imgName);
        //     // console.log('----');
        //     if (img.sorce !== null) {
        //         var viewSource = await page.goto(img.sorce);
        //         await fs.writeFileSync(dir + slugify(img.imgName), await viewSource.buffer());
        //     }
        // }
        console.log('Termine con ' + carpeta.nombre);
        console.log('--- o ---');
        
    }
    console.log('---< o >---');
    console.log('---< o >---');
    console.log('Done!');
    await browser.close();
})();