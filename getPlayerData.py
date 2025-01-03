import sqlite3
from selenium import webdriver
from bs4 import BeautifulSoup

def create_database():
    # Connect to SQLite database (or create it if it doesn't exist)
    conn = sqlite3.connect("players.db")
    cursor = conn.cursor()

    # Create a table for players if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            overall INTEGER NOT NULL,
            position TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def insert_player(name, overall, position):
    # Insert a player into the database
    conn = sqlite3.connect("players.db")
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO players (name, overall, position) VALUES (?, ?, ?)
    ''', (name, overall, position))

    conn.commit()
    conn.close()

def get_data(pos):
    # Set the URL for scraping
    url = f"https://www.2kratings.com/lists/{pos}"

    # Set up Selenium WebDriver
    driver = webdriver.Chrome()  # Ensure you have the correct ChromeDriver installed
    driver.get(url)

    # Parse the page source with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, "lxml")
    driver.quit()

    # Find the table containing players
    table = soup.find("tbody")
    if not table:
        print(f"No data found for position: {pos}")
        return

    # Iterate through the rows in the table
    for player in table.find_all("tr"):
        try:
            # Extract player data
            name = player.find_all("td")[1].div.find_all('span')[2].a.text
            overall = int(player.find_all("td")[2].div.span.text)
            position = pos

            # Print player data (optional)
            print(name, overall, position)

            # Insert player data into the database
            insert_player(name, overall, position)
        except Exception as e:
            print(f"Error processing player: {e}")
            continue

positions = ["point-guard", "shooting-guard", "small-forward", "power-forward", "center"]
get_data(positions[0])
