 ECommerce Website

Run Locally
------------
1. Clone repo
   . $ git clone https://github.com/0mar-elsayad/E-commerce-Website.git
     $ cd node-javascript-ecommerce
   
2. Setup MongoDB
       Download and Install it from mongodb.com

3. Create .env file
Create .env file in project folder
Enter these lines to that:
4. Run Backend
     $ npm install
     $ npm run build
     $ npm start

5. Run Frontend
    # open new terminal
     $ cd frontend
     $ npm install
     $ npm start

6. Create Admin User
Run this on chrome: http://localhost:4000/api/users/'/signup'
Note admin email and password


7. Admin Login
Run http://localhost:8080/#/signin
Enter admin email and password and click signin
Click Dashboard Link on Header Menu
Click Products on left sidebar
Click Create Product Button
Enter Product Information
Go to home page (http://localhost:8080) and test Ecommerce Website

  Features
-------------
1.Home Screen
   Static Web Page Design
   CSS Grid to create website layout
   Flexbox to shape product thumbnails and responsive design
   
2.Product Screen
    create single page application
    Create buttons and add events to buttons
    
3.Cart Screen
    Save and retrieve data in local storage
    Master in javascript array functions
    Use combo box and add event to it
    re-render screen based on changes in item count
    
4.Sign-in and Register Screen
    Create dynamic form
    Input validation in frontend and backend
    Create web server using node.js
    Connect to Mongodb database
    Add registered user to the database
    Authenticate user based on email and password
    Using Jsonwebtoken to authorize users
    
5.Shipping and Payment Screen
   Create wizard form to get user data in multiple steps
   Save user info in the local storage
   Place Order Screen
   Validate and create order in the database






