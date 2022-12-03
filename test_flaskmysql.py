# following code is wriiten to fetch data from mysql to read in python using flask package
from flask import Flask
from flaskext.mysql import MySQL

app = Flask(__name__)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'vanessahu'
app.config['MYSQL_DATABASE_PASSWORD'] = 'q!w@e#r$t%00'
app.config['MYSQL_DATABASE_DB'] = 'bank'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


conn = mysql.connect()
cursor =conn.cursor()

cursor.execute("SELECT * from BankAccount")
data = cursor.fetchall()



print(data)