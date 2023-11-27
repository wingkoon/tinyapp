# TinyApp Project
by Kevin, Wing Koon Leung

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).
It also incorporates method-override(enables put and delete) and analytics for taking total visitors and unique visitors for a particular URL, recording the creation date and time, logging the timestamp of each user login.

## Final Product

!["Homepage will turn to login page if not login"](./docs/login.jpg)
!["If the user has not register, he can go to this register page."](./docs/register.jpg)
!["After register or success login, it will turn to this url main page."](./docs/urls.jpg)
!["We can create URL by going to create new URL page."](./docs/create.jpg)
!["After URL created, new URL appear, with the assigned shorten URL. There are a few analytics: the date created, visit column shows the total visit number, user column shows the unique visitor number. We can go to the URL by clicking either the short or long form of URL."](./docs/url_with_an_URL_input.jpg)
!["If we visit the URL, and then come back to the url page of this app, the analytics will show changes."](./docs/visit_url_then_come_back.jpg)
!["If we click Edit, it will go to this Edit page. Full analytics are also shown on the pages. There are date and time of creation, total visitors, unique visitors, and the visit history that include the visit ID and the timestamp."](./docs/Edit.jpg)

## Technologies Used
- HTML5
- EJS
- JavaScript 
- bcrypt (for encryption)
- Node.js and Express (for backend server functionality)
- method-override

## Dependencies

- Node.js
- Express
- EJS
- Chance
- bcryptjs
- cookie-session
- method-override

## Getting Started

1. Download the software.

git clone git@github.com:wingkoon/tinyapp.git

2. Prepare for the dependency.

- Go to the directory /tinyapp
- Install all dependencies (using the `npm install` command).
i.e.,       
    npm install
    npm install bcryptjs
    npm install cookie-session
    npm install method-override

3. Run your node server.

- Run the development web server using the `npm start` command.

4. Browse to `http://localhost:8080/`


- Enjoy all its features


