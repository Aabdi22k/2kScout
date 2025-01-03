import sqlite3
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Connect to the SQLite database
db_path = "players.db"
connection = sqlite3.connect(db_path)
cursor = connection.cursor()

# Add a column for player images if it doesn't exist
# cursor.execute("""
#     ALTER TABLE players ADD COLUMN img TEXT
# """)
# connection.commit()

# Fetch all player names from the database
cursor.execute("SELECT name FROM players")
player_names = cursor.fetchall()  # List of tuples (e.g., [('LeBron James',), ('Kevin Durant',)])

# Set up Selenium WebDriver
driver = webdriver.Chrome()  # Use the appropriate driver
driver.get("https://www.nba.com/players")

time.sleep(5)  # Allow the page to load

# Ensure "Show Historic" is toggled on
try:
    toggle = driver.find_element(By.CSS_SELECTOR, "label.Toggle_toggle__2_SBA.PlayerList_toggle__RL_YD")
    is_active = toggle.get_attribute("data-is-active")
    if is_active != "true":  # If not already active, click to enable it
        toggle.click()
        print("Enabled 'Show Historic' toggle.")
    else:
        print("'Show Historic' toggle is already active.")
    time.sleep(10)  # Wait for the change to take effect
except Exception as e:
    print("Error toggling 'Show Historic':", e)
    driver.quit()
    connection.close()
    exit()

# Iterate through each player name and search for their image
for player_name in player_names:
    name = player_name[0]
    
    try:
        # Find the search input element
        search_bar = driver.find_element(By.CSS_SELECTOR, "input[aria-label='Player Natural Search Bar']")
        
        # Clear any existing text and input the player's name
        search_bar.clear()
        search_bar.send_keys(name)
        search_bar.send_keys(Keys.RETURN)
        
        time.sleep(3)  # Wait for the search results to load
        
        # Find the player image element
        try:
            player_image = driver.find_element(By.CSS_SELECTOR, "img.PlayerImage_image__wH_YX")
            img_src = player_image.get_attribute("src")  # Get the image URL

            # Update the database with the player's image URL
            cursor.execute("UPDATE players SET img = ? WHERE name = ?", (img_src, name))
            connection.commit()
            print(f"Updated {name} with image URL: {img_src}")
        except Exception as e:
            print(f"Could not find an image for {name}. Error: {e}")
    
    except Exception as e:
        print(f"Search failed for {name}. Error: {e}")

# Close the Selenium driver and database connection
driver.quit()
connection.close()
