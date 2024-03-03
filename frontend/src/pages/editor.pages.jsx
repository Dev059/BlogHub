// Here when someone is logged in then only we will want to show the editor page. So, we will use the access token to check if the user is logged in or not.

import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';


const Editor = () => {

    const [ editorState, setEditorState ] = useState("editor"); // to show blogEditor or PublishForm 

    let { userAuth: { access_token } } = useContext(UserContext);

    return (
        <>
        {
            access_token === null ? 
            <Navigate to="/signin" /> 
            : editorState == "editor" ? 
            <BlogEditor /> : <PublishForm />
        }

        </>
    )
}

export default Editor;