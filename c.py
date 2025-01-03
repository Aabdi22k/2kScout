import sqlite3

# Connect to the SQLite database
db_path = "players.db"
connection = sqlite3.connect(db_path)
cursor = connection.cursor()

def update_player_img_by_id(player_id, new_img_url):
    """
    Update the image URL for a player in the database by their ID.

    Args:
    - player_id (int): The ID of the player to update.
    - new_img_url (str): The new image URL to set.
    """
    try:
        # Check if the player exists
        cursor.execute("SELECT name, img FROM players WHERE id = ?", (player_id,))
        player = cursor.fetchone()
        if not player:
            print(f"No player found with ID {player_id}.")
            return

        # Update the player's image URL
        cursor.execute("UPDATE players SET img = ? WHERE id = ?", (new_img_url, player_id))
        connection.commit()
        print(f"Updated player '{player[0]}' (ID: {player_id}) with new image URL: {new_img_url}")
    except sqlite3.Error as e:
        print(f"Error updating player image: {e}")

# User Input
if __name__ == "__main__":
    try:
        player_id = 500
        new_img_url = "https://cdn.nba.com/headshots/nba/latest/260x190/1642276.png"
        # Call the function to update the player's image
        update_player_img_by_id(player_id, new_img_url)
    finally:
        # Close the database connection
        connection.close()
