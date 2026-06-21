import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    os.makedirs('screenshots', exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to story
        print("Navigating to http://localhost:5173/story/fall-of-caesar")
        await page.goto("http://localhost:5173/story/fall-of-caesar", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # Take a screenshot of Scene 1
        await page.screenshot(path="screenshots/scene1.png")
        print("Screenshot saved to screenshots/scene1.png")

        # Click next by clicking on the right 2/3 of the screen
        bounds = await page.evaluate("() => ({ width: window.innerWidth, height: window.innerHeight })")
        print(f"Window bounds: {bounds}")
        x = bounds['width'] * 0.8
        y = bounds['height'] * 0.5

        await page.mouse.click(x, y)
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshots/scene1-5.png")
        print("Screenshot saved to screenshots/scene1-5.png")

        # Now click choice
        try:
            print("Looking for choice: Ponder his words")
            await page.get_by_text("Ponder his words").click(timeout=5000)
            await page.wait_for_timeout(2000)
            await page.screenshot(path="screenshots/scene2.png")
            print("Screenshot saved to screenshots/scene2.png")
        except Exception as e:
            print("Failed to click choice:", e)

        try:
            print("Looking for choice: I am Caesar. I fear no dreams. (Go to Senate)")
            await page.get_by_text("I am Caesar. I fear no dreams. (Go to Senate)").click(timeout=5000)
            await page.wait_for_timeout(2000)
            await page.screenshot(path="screenshots/scene3.png")
            print("Screenshot saved to screenshots/scene3.png")
        except Exception as e:
            print("Failed to click choice:", e)

        try:
            print("Looking for choice: Greet Brutus")
            await page.get_by_text("Greet Brutus").click(timeout=5000)
            await page.wait_for_timeout(2000)
            await page.screenshot(path="screenshots/scene4.png")
            print("Screenshot saved to screenshots/scene4.png")
        except Exception as e:
            print("Failed to click choice:", e)

        try:
            print("Looking for choice: Struggle free")
            await page.get_by_text("Struggle free").click(timeout=5000)
            await page.wait_for_timeout(2000)
            await page.screenshot(path="screenshots/scene5.png")
            print("Screenshot saved to screenshots/scene5.png")
        except Exception as e:
            print("Failed to click choice:", e)

        # Next scene (isCliffhanger)
        try:
            print("Looking for Next by click")
            await page.mouse.click(x, y)
            await page.wait_for_timeout(2000)
            await page.screenshot(path="screenshots/scene6.png")
            print("Screenshot saved to screenshots/scene6.png")
        except Exception as e:
            print("Failed to click choice:", e)


        await browser.close()

asyncio.run(main())
