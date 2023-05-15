# Brandta Blog

## Description
The Brandta Blog is a CMS-Style-Blog-Site that lets registered users share titled posts and comments. This app was built with Node and Express, and templated with Handlebars. The app can create user accounts and store their posts and comments on a server-side database using the Sequelize ORM for MySQL via JAWSDB on Heroku.

## Installation
A few environment variables are needed in a `.env` file:
* `DB_NAME = challenge_db`: the Sequelize instance will use this database when manipulating the `User`, `Comment` and `Post` models
* `DB_USER`: name of the MySQL user, which is `root` by default
* `DB_PASS`: the password for your MySQL server
```
npm i
npm run start:dev
```
The server is now running locally at http://localhost:3000

## Deployment
The site is deployed on Heroku: https://brandta-blog.herokuapp.com/

## Preview
![blog-preview](https://github.com/brandta-1/CMS-Style-Blog-Site/assets/116298512/419813d1-9d1b-4041-b1a0-8232ea74a215)

