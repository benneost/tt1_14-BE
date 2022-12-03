import os
import subprocess
import json
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# configstr = "mysql+mysqlconnector://admin:Cbasdf1234%@database-1.caeirjmmwril.ap-southeast-1.rds.amazonaws.com/lms"
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_size": 100, "pool_recycle": 280}
# app.config["SQLALCHEMY_DATABASE_URI"] = configstr


############## Login ###############################################

# @app.route("/login/<string:username>")
# def login_staff_by_username(username):
#     return staff.get_staff_by_username(username)

############## Transaction ###############################################



    
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)