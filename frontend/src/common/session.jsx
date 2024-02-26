// Here we have made session to store the user data and to remove the user data from the session.
// This is done to keep the user logged in after the user has logged in.

const storeInSession = (key, value) => {
    return sessionStorage.setItem(key, value);
}

const lookInSession = (key) => {
    return sessionStorage.getItem(key);
}

const removeFromSession = (key) => {
    return sessionStorage.removeItem(key);
}

const logOutUser = () => {
    sessionStorage.clear();
} 

export { storeInSession, lookInSession, removeFromSession, logOutUser};