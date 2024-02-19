import puppeteer from 'puppeteer';
import * as nodemailer from 'nodemailer';

async function scrapeAndCheck(url: string, searchString: string): Promise<{ message: string, found: boolean }> {
  try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');
      await page.goto(url, { waitUntil: 'networkidle2' });

      const content = await page.content(); 

 
      if (content.includes(searchString)) {
          const message = `NEW OP SET: "${searchString}"`;
          console.log(message);
          await browser.close();
        
          return { message, found: true };
      } else {
          console.log(`"${searchString}" not found on the page.`);
          await browser.close();
      
          return { message: `"${searchString}" not found on the page.`, found: false };
      }
  } catch (error) {
      console.error(`Error scraping ${url}: `, error instanceof Error ? error.message : String(error));
      throw new Error(`Error scraping ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function sendAlertEmail(url: string, searchString: string, recipientEmail: string): Promise<void> {
    try {
        const {message, found} = await scrapeAndCheck(url, searchString);
        if (!found) {
          return
        }
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: '',
                pass: '' 
            }
        });

        const mailOptions = {
            from: '',
            to: recipientEmail,
            subject: '',
            text: message
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}


const url = 'https://www.ebgames.com.au/search?q=one+piece+card+game';
const searchString = "OP-09";
const recipientEmail = '';
sendAlertEmail(url, searchString, recipientEmail);


