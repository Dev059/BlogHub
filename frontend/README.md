Data flow in this project is 

1. main.jsx -> "BrowserRouter" from react-router-dom
                App.jsx

2. App.jsx -> 
            Routes and Route from react-router-dom 
            editor.pages.jsx is used for editing and writing blog
            navbar.component.jsx 
            userAuthForm.pages.jsx
            lookInSession is used to find session from session.jsx
            then
            useContext() is made to send access_token and profile_img

3. navbar.component.jsx ->  
                logo.png
                search box and its visibility using useState()
                access_token and profile_img receive from App.jsx using useContext()
                if access_token is NULL then 
                    user-navigation.component.jsx which slides down which has signOUT feature too
                else
                    signIN/signUP button

5. user-navigation.component.jsx ->

4. userAuthForm.pages.jsx
