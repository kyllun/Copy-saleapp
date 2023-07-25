from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import cloudinary

app = Flask(__name__)
app.secret_key = 'IYRV%$DWvbignyhuiojNJGUBFKHJhjkFVHkbj*&tuy'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:lelan2563@localhost/labsaledb?charset=utf8mb4'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['PAGE_SIZE'] = 8
app.config['COMMENT_SIZE'] = 20

db = SQLAlchemy(app=app)



cloudinary.config(
    cloud_name = 'djga3njzi',
    api_key = '595946198281489',
    api_secret = 'hd1cRj177f0HVAQ-vSeqG_yT9Y0'
)

login = LoginManager(app=app)