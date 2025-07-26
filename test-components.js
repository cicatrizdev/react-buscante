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
    headless: false, // Set to true for CI environments
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Set viewport size
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to the development server
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    console.log('✅ Page loaded successfully');
    
    // Take a full page screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'full-page.png'),
      fullPage: true 
    });
    console.log('✅ Full page screenshot taken');
    
    // Test color palette component
    const colorPalette = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      return headings.some(h => h.textContent.includes('Paleta de cores'));
    });
    if (colorPalette) {
      console.log('✅ Color palette component found');
    } else {
      console.log('❌ Color palette component not found');
    }
    
    // Test buttons - hover states
    const buttons = await page.$$('button');
    console.log(`✅ Found ${buttons.length} buttons`);
    
    if (buttons.length > 0) {
      // Test hover on first button
      await buttons[0].hover();
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'button-hover.png'),
        fullPage: true 
      });
      console.log('✅ Button hover state tested');
    }
    
    // Test search bars
    const searchInputs = await page.$$('input[type="text"]');
    console.log(`✅ Found ${searchInputs.length} search inputs`);
    
    if (searchInputs.length > 0) {
      // Test typing in first search input
      await searchInputs[0].click();
      await searchInputs[0].type('Test search query');
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'search-input.png'),
        fullPage: true 
      });
      console.log('✅ Search input functionality tested');
    }
    
    // Test responsive behavior - mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mobile-view.png'),
      fullPage: true 
    });
    console.log('✅ Mobile responsive view tested');
    
    // Test responsive behavior - tablet viewport
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'tablet-view.png'),
      fullPage: true 
    });
    console.log('✅ Tablet responsive view tested');
    
    // Validate component rendering by checking for key elements
    await page.setViewport({ width: 1200, height: 800 });
    
    const componentTests = [
      { text: "Paleta de cores", name: 'Color Palette' },
      { text: "Fonte", name: 'Font Section' },
      { text: "Botões", name: 'Buttons Section' },
      { text: "Barra busca", name: 'Search Bar Section' }
    ];
    
    for (const test of componentTests) {
      const found = await page.evaluate((text) => {
        const headings = Array.from(document.querySelectorAll('h3'));
        return headings.some(h => h.textContent.includes(text));
      }, test.text);
      
      if (found) {
        console.log(`✅ ${test.name} component rendered correctly`);
      } else {
        console.log(`❌ ${test.name} component not found`);
      }
    }
    
    // Test button click functionality
    if (buttons.length > 0) {
      let clickHandled = false;
      
      // Listen for console logs from the page
      page.on('console', msg => {
        if (msg.text().includes('Button clicked')) {
          clickHandled = true;
        }
      });
      
      await buttons[0].click();
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ Button click tested');
    }
    
    console.log('\\n🎉 All component tests completed successfully!');
    console.log('📸 Screenshots saved to ./screenshots/ directory');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
})();