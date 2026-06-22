import puppeteer from 'puppeteer'

export interface ElementLayout {
    selector: string
    tagName: string
    box: {
        x: number
        y: number
        height: number
        width: number
    };
    outerHtml: string
}


export interface CaptureResult {
    buffer: Buffer;
    layout: ElementLayout[];
}


const captureScreenshot = async (url: string): Promise<CaptureResult> => {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    try {

        const page = await browser.newPage();

        await page.setViewport({ width: 1280, height: 800 });

        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        await page.addStyleTag({
    content: `
        *, *::before, *::after {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            transition: none !important;
            -webkit-animation: none !important;
            -moz-animation: none !important;
            -o-animation: none !important;
            animation: none !important;
            animation-delay: 0s !important;
            transition-delay: 0s !important;
        }
    `
});



        // page.evaluate to extract HTML element coordinates.
        const layout = await page.evaluate((): ElementLayout[] => {
            const elements = Array.from(document.querySelectorAll('button, a, input, img, h1, h2, h3, p, header, nav, section, footer, ' +
  'div[class*="card"], div[class*="btn"], div[class*="container"], div[class*="sidebar"]'));

             return elements.map(el  => {

                const rect = el.getBoundingClientRect();
         /* 
                   Return by getBoundingClientRect()
                    Button starts at: 
                    X = 100px
                    Y = 50px
                    Size:
                    200px wide
                    40px height
        */    
              // build a selector that returns any tagName as a string for LLM model to comprehend for example : button#idname
              let selector = el.tagName.toLowerCase();
              if(el.id){
                selector += `#${el.id}`
              }else if(el.className) {
                  const firstClass = el.className.trim().split(/\s+/)[0];
                if (firstClass && typeof firstClass === 'string') {
                 selector += `.${firstClass}`;
              }
            }

             //  Return the ElementLayout object for this element
              return {
                selector,
                tagName : el.tagName,
                box : {
                    x : rect.x + window.scrollX,
                    y : rect.y + window.scrollY,
                     width: rect.width,
                     height: rect.height
                },
               
                // Slicing the HTML so the memory doesnt clog
                 outerHtml: el.outerHTML.substring(0, 400)
              }
            
             })
              // Filtering out elements that are invisible (width/height is 0)
             .filter(item => item?.box.width > 0 && item?.box.height > 0);
        })


        const buffer = await page.screenshot({ type: 'png', fullPage: true })

        return  {
            buffer : buffer as Buffer,
            layout,
        }
    } finally {
        await browser.close()
    }
}

export default captureScreenshot