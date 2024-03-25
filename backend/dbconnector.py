import mysql.connector
import sqlite3

def create_connection(host_name, user_name, user_password, db_name):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print("Connection to MySQL DB successful")
    except Exception as e:
        print(f"The error '{e}' occurred")

    return connection

# Replace with your actual details
connection = create_connection("localhost", "root", "bakamoto", "project")




