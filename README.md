# TinyApp Project
by Kevin, Wing Koon Leung

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Homepage will turn to login page if not login"](Login.jpg)
!["If the user has not register, he can go to this register page."](register.jpg)
!["After register or success login, it will turn to this homepage."](urls.jpg)
!["This is the URL create page."](create.jpg)
!["After URL created, new URL appear, with the assigned shorten URL."](urls_after_create.jpg)
!["This is the URL edit page."](edit.jpg)
!["After the edit, the URL changed. If we select the delete function, the selected URL will be deleted."](urls_after_edit.jpg)

## Technologies Used
- HTML5
- EJS
- JavaScript 
- bcrypt (for encryption)
- Node.js and Express (for backend server functionality)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

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

3. Run your node server.

- Run the development web server using the `npm run start` command.

4. Browse to `http://localhost:8080/`


- Enjoy all its features


