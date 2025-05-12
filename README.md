This is my own solution to JSNinjas test task.

To run application follow next steps:

download repository (clone or download zip file)
install dependencies on frontend and backend by open terminal in each folders and run npm install.
open your database app, i use pgAdmin 4, create database with custom name and table using command

CREATE TABLE superheroes (
id SERIAL PRIMARY KEY,
nickname TEXT NOT NULL,
real_name TEXT NOT NULL,
origin_description TEXT,
superpowers TEXT,
image TEXT
);

on backend create .env file and insert there this part of variables and input youd db name and password
APP_PORT=5000
APP_HOST="localhost"
DATABASE_URL="postgresql://postgres:password2@localhost:5432/superheroes_db"
NODE_ENV="development"

You also need to login to AWS and create there s3 bucket, user and policy to be able to save images there.
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_S3_BUCKET_NAME="superheroes-jsninjas"
AWS_S3_REGION="eu-central-1"
AWS_S3_ACL="public-read"
AWS_S3_ENDPOINT="https://superheroes-jsninjas.s3.amazonaws.com"

start backend with command npm run watch:server

go to frontend folder and run it with command npm run dev

Now you are ready to go :)
