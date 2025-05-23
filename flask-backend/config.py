import os
import urllib.parse

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super_secret_key_12345')
    password = urllib.parse.quote_plus('Hazem@2003')
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://root:{password}@localhost/so_web'
    SQLALCHEMY_TRACK_MODIFICATIONS = False 