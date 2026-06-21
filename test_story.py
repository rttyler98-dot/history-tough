import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to story
        print("Navigating to http://localhost:5173/story/fall-of-caesar")
        await page.goto("http://localhost:5173/story/fall-of-caesar", wait_until="networkidle")

        # Take a screenshot
        await page.screenshot(path="test_story_dynamic.png")
        print("Screenshot saved to test_story_dynamic.png")

        await browser.close()

asyncio.run(main())
