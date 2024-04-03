Data flow in this project is 

1. main.jsx -> 
            1. "BrowserRouter" from react-router-dom
            2.  App.jsx

2. App.jsx -> 
            1. Routes and Route from react-router-dom 
            2. editor.pages.jsx is used for editing and writing blog.
            3. navbar.component.jsx 
            4. userAuthForm.pages.jsx
            5. lookInSession is used to find session from session.jsx
            then
            6. useContext() hook is made to send access_token and profile_img

            It also takes care of session of user by finding the user with its acess token. If found then parsing token with JSON format or null

3. editor.pages.jsx -> 


4. navbar.component.jsx ->  
            1. logo.png
            2. search box and its visibility using useState()
            3. access_token and profile_img receive from App.jsx  using useContext()
            4. if access_token is NULL then 
                user-navigation.component.jsx which slides down which has signOUT feature too
                else
                signIN/signUP button

5. user-navigation.component.jsx ->

4. userAuthForm.pages.jsx
