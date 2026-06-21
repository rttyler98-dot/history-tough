from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    print("Navigating to http://localhost:5173/")
    page.goto("http://localhost:5173/")

    # Wait for the network to be idle
    page.wait_for_load_state('networkidle')

    # Wait a second for animations to settle
    page.wait_for_timeout(2000)

    # Take screenshot
    page.screenshot(path="test_home_dynamic.png", full_page=True)
    print("Screenshot saved to test_home_dynamic.png")

    browser.close()
