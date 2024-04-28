import puppeteer from 'puppeteer';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as toml from '@iarna/toml';

interface Config {
    url: string;
    searchString: string;
    recipientEmail: string;
    user: string;
    pass: string;
    from: string;
    subject: string;
    service : string
    message : string
}

async function loadConfig(): Promise<Config> {
    const configFileContents = fs.readFileSync('./config.toml', 'utf-8');
    const config = toml.parse(configFileContents);
    return config as unknown as Config;
}

async function scrapeAndCheck(url: string, searchString: string): Promise<boolean> {
  try {
      const browser = await puppeteer.launch();
 // --use this code if on a raspberry pi     const browser = await puppeteer.launch({
 // executablePath: '/usr/bin/chromium-browser', 
//  args: ['--no-sandbox', '--disable-setuid-sandbox'] 
//}); 
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');
      await page.goto(url, { waitUntil: 'networkidle2' });

      const content = await page.content(); 

 
      if (content.includes(searchString)) {
          await browser.close();
          return true;
      } else {
          console.log(`"${searchString}" not found on the page.`);
          await browser.close();
          return false;
      }
  } catch (error) {
      console.error(`Error scraping ${url}: `, error instanceof Error ? error.message : String(error));
      throw new Error(`Error scraping ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function sendAlertEmail(config: Config): Promise<void> {
    try {
        const found = await scrapeAndCheck(config.url, config.searchString);
        if (!found) {
          return
        }
        const transporter = nodemailer.createTransport({
            service: config.service,
            auth: {
                user: config.user,
                pass: config.pass 
            }
        });

        const mailOptions = {
            from: config.from,
            to: config.recipientEmail,
            subject: config.subject,
            text: config.message,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        transporter.close();
        });
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

async function main() {
    const config = await loadConfig();
    console.log("test");
    
    setInterval(() => {
        sendAlertEmail(config);
    }, 120000); // 
}

main();
