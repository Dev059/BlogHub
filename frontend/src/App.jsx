import { Routes , Route} from 'react-router-dom'
import Navbar from './components/navbar.component'
import UserAuthForm from './pages/userAuthForm.pages'
import { createContext, useEffect, useState } from 'react'
import { lookInSession } from './common/session';
import Editor from './pages/editor.pages';
import HomePage from './pages/home.page';
import SearchPage from './pages/search.page';
import PageNotFound from './pages/404page';
import ProfilePage from './pages/profile.page';
import BlogPage from './pages/blog.page';

// createContext is used to pass down value deep to the components without using props from one component to other component
// for userAuth, it has access token send it to the components
export const UserContext = createContext({});

const App = () => {

  // store after checking whether user is logged in or not
  const [userAuth, setUserAuth] = useState({});

  // useEffect will run only one time
  useEffect(() => {

    let userInSession = lookInSession("user");

    userInSession ? 
    setUserAuth(JSON.parse(userInSession)) : 
    setUserAuth({access_token: null});
  }, []);

  return (
    // This line will provide the value to the whole component. So any user want to use it can use using context hook
    <UserContext.Provider value={{userAuth, setUserAuth}}>
      
      <Routes>
        <Route path="/editor"  element={ <Editor/>} />
        <Route  path="/" element={<Navbar/>}>
          <Route index element={<HomePage/>}/>
          <Route  path="signin" element={<UserAuthForm type="sign-in" />}/> 
          <Route  path="signup" element={<UserAuthForm type="sign-up" />}/>
          <Route path='search/:query' element={<SearchPage/>}/>
          <Route path='user/:id' element={<ProfilePage />}/>
          <Route path='blog/:blog_id' element={<BlogPage/>} />
          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  )
}
//  "/" + "signin" = "/signin" 

export default App;