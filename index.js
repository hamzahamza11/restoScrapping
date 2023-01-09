// const puppeteer = require('puppeteer') ;

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setDefaultNavigationTimeout(0); 
  
//   console.log("before")

//   await page.goto('https://developers.google.com/web/');
//   console.log("afetr")

//   // Type into search box.
// //   await page.type('.devsite-search-field', 'Headless Chrome');

// //   // Wait for suggest overlay to appear and click "show all results".
// //   const allResultsSelector = '.devsite-suggest-all-results';
// //   await page.waitForSelector(allResultsSelector);
// //   await page.click(allResultsSelector);

// //   // Wait for the results page to load and display the results.
// //   const resultsSelector = '.gsc-results .gs-title';
// //   await page.waitForSelector(resultsSelector);

// //   // Extract the results from the page.
// //   const links = await page.evaluate(resultsSelector => {
// //     return [...document.querySelectorAll(resultsSelector)].map(anchor => {
// //       const title = anchor.textContent.split('|')[0].trim();
// //       return `${title} - ${anchor.href}`;
// //     });
// //   }, resultsSelector);

// //   // Print all the files.
// //   console.log(links.join('\n'));

// //   await browser.close();
// })();

const puppeteer = require('puppeteer');
const writeXlsxFile = require('write-excel-file/node')
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }



(async () => {
    const schema = [
        {
            column: 'CITY',
            type: String,
            value: student => student.title
        },
        {
          column: 'title',
          type: String,
          value: student => student.titleResto 
        },
        {
          column: 'email',
          type: String,
          value: student => student.email 
        },
        {
          column: 'phone',
          type: String,
          value: student => student.tele
        }
     
      ]
    let data =[]
    var nbrCities;
    var nbrResto;
    var currentTitle;
    var linksOfCities =[]
    

    let restoByCities = []

    let finalData=[]
    // Create an instance of the chrome browser
    // But disable headless mode !
    const browser = await puppeteer.launch({
        headless: false
    });

    // Create a new page
    const page = await browser.newPage();

    // Configure the navigation timeout
    await page.goto('https://www.bestrestaurantsmaroc.com/', {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
    });

    // Navigate to some website e.g Our Code World
    await page.goto('https://www.bestrestaurantsmaroc.com/');

    // Do your stuff
    await delay(5000)

    // /html/body/div[2]/div/div[4]/div[1]/div

    const [element] = await page.$x('/html/body/div[2]/div/div[4]/div[1]/div');
    const children = await element.getProperty('children');
    nbrCities = await (await children.getProperty('length')).jsonValue();
    console.log(nbrCities); // 3

    // for ( let i=2 ; i< nbrCities ;i++ ){

    const item = await page.$x(`/html/body/div[2]/div/div[4]/div[1]/div/div[2]/a`);
    try {
        const hrefs1 = await item[0].evaluate(
            () => Array.from(
              document.querySelectorAll('.categories-container > .br-categorie > a'),
              a => a.getAttribute('href')
            )
          );
     
          linksOfCities =hrefs1
         
    } catch (error) {
        console.log(error)
        
    }
  
  

  

    // }

    
    
    for(let j=0 ; j < nbrCities;j++ ){
    const obj ={}
    await page.goto(`https://www.bestrestaurantsmaroc.com${linksOfCities[j]}`)
    const title =  await page.$x(`/html/body/div[3]/div/div[1]/div[1]/div[1]/h1`); 
    await delay(1000)
    let value = await page.evaluate(el => el.textContent, title[0])
    obj.title = value
    const item = await page.$x(`//*[@id="restaurants"]/div/div[1]/a`);
    try {
        if(item[0]){
            const resto = await item[0].evaluate(
                () => Array.from(
                  document.querySelectorAll('.block-option-restaurant-image >  a'),
                  a => a.getAttribute('href')
                )
              );
         
            obj.resto = resto
        }
       
         
    } catch (error) {
        console.log(error)
        
    }


    restoByCities.push(obj)
    // const resto = await item[0].evaluate(
    //     () => Array.from(
    //       document.querySelectorAll(''),
    //       a => a.getAttribute('href')
    //     )
    //   );

    //   console.log(resto)

    await delay(5000)




   }
    
   
    // console.log(restoByCities)
    let endLoop =0

    // restoByCities.map(async (resto) =>{
        
    //     console.log("hello")

        for(let t =0 ; t<restoByCities?.length ; t++){
            console.log(restoByCities[t].title)

        if(restoByCities[t]?.resto && restoByCities[t]?.resto?.length != 0){
            for(let k =0 ; k<restoByCities[t].resto.length ; k++){
                console.log(restoByCities)
                const info ={}
                info.title= restoByCities[t].title
            // for(let k =0 ; k<2 ; k++){
                await page.goto(`https://www.bestrestaurantsmaroc.com/${restoByCities[t].resto[k]}`)
               
                const titleResto =  await page.$x(`/html/body/div[3]/div/div/div/div/div[4]/div[1]/div[1]/div[1]/h1`); 
                await delay(1000)

                let valueResto = await page.evaluate(el => el.textContent, titleResto[0])
                if(valueResto){
                    info.titleResto = valueResto.trim()
                }
                const title =  await page.$x(`/html/body/div[3]/div/div/div/div/div[4]/div[1]/div[1]/div[3]/span[2]`); 
                await delay(1000)
                let value = await page.evaluate(el => el.textContent, title[0])
                if(value){
                   info.email = value.trim()
                }
               
                const teleButton =  await page.$x(` /html/body/div[3]/div/div/div/div/div[4]/div[1]/div[2]/div[1]/button`); 
                await teleButton[0].click()
                await delay(2000)

               

                const tele =  await page.$x(` /html/body/div[3]/div/div/div/div/div[6]/div/div/div[2]/div[1]`); 
                await delay(1000)
                let teleContent = await page.evaluate(el => el.textContent, tele[0])
                console.log(teleContent.substring(12))
                info.tele = teleContent.substring(12)

                finalData.push(info)

            }
        }
        endLoop = endLoop++
        await writeXlsxFile(finalData, {
            schema,
            filePath: `./file${endLoop}.xlsx`
          })
        console.log("endloop",endLoop)
       
    }
console.log("befor execl")
if(endLoop == 13) {
    await writeXlsxFile(restoByCities, {
        schema,
        filePath: './file.xlsx'
      })
    
}

   
      console.log("after execl")
    
   

    // /html/body/div[2]/div/div[4]/div[1]/div/div[3]
    // ...
})();