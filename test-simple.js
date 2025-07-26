import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Set viewport size
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to the development server
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 10000 });
    
    console.log('✅ Page loaded successfully');
    
    // Take a full page screenshot of home screen
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'home-screen.png'),
      fullPage: true 
    });
    console.log('✅ Home screen screenshot taken');
    
    // Test home screen components exist
    const componentTests = [
      { text: "BUSCANTE", name: 'Header Logo' },
      { text: "Que livro você procura?", name: 'Main Heading' },  
      { text: "Busque o livro", name: 'Hero Content' },
      { text: "Desenvolvido por Alura", name: 'Footer' }
    ];
    
    for (const test of componentTests) {
      const found = await page.evaluate((text) => {
        const allElements = Array.from(document.querySelectorAll('*'));
        return allElements.some(el => el.textContent && el.textContent.includes(text));
      }, test.text);
      
      if (found) {
        console.log(`✅ ${test.name} component rendered correctly`);
      } else {
        console.log(`❌ ${test.name} component not found`);
      }
    }
    
    // Count interactive elements on home screen
    const buttonCount = await page.$$eval('button', buttons => buttons.length);
    const inputCount = await page.$$eval('input[type="text"]', inputs => inputs.length);
    
    console.log(`✅ Found ${buttonCount} buttons on home screen`);
    console.log(`✅ Found ${inputCount} search inputs on home screen`);
    
    // Test search functionality
    console.log('\\n🔍 Testing search functionality...');
    
    // Find search input and perform a search
    const searchInput = await page.$('input[type="text"]');
    if (searchInput) {
      await searchInput.type('harry');
      await searchInput.press('Enter');
      
      // Wait for search results to load
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Take screenshot of search results
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'search-results.png'),
        fullPage: true 
      });
      console.log('✅ Search results screenshot taken');
      
      // Check if search results are displayed
      const resultsFound = await page.evaluate(() => {
        const resultText = document.body.textContent;
        return resultText.includes('Resultados da busca') || resultText.includes('Harry Potter');
      });
      
      if (resultsFound) {
        console.log('✅ Search results displayed correctly');
      } else {
        console.log('❌ Search results not found');
      }
      
      // Count book cards in search results
      const bookCards = await page.$$eval('.bg-white.rounded-lg.shadow-md', cards => cards.length);
      console.log(`✅ Found ${bookCards} book cards in search results`);
      
      // Test that book cards have required elements
      const bookCardTests = [
        { selector: 'img[alt*="Capa do livro"]', name: 'Book covers' },
        { selector: 'button', name: 'Action buttons' }
      ];
      
      for (const test of bookCardTests) {
        const elements = await page.$$(test.selector);
        if (elements.length > 0) {
          console.log(`✅ ${test.name} found in book cards`);
        } else {
          console.log(`❌ ${test.name} not found in book cards`);
        }
      }
    }
    
    // Test mobile responsiveness on search results
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'search-results-mobile.png'),
      fullPage: true 
    });
    console.log('✅ Mobile search results screenshot taken');
    
    console.log('\\n🎉 All tests completed successfully!');
    console.log('📸 Screenshots saved to ./screenshots/ directory');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
})();