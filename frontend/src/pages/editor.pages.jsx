// Here when someone is logged in then only we will want to show the editor page. So, we will use the access token to check if the user is logged in or not.

import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';
import { createContext } from "react";

// empty structure for our blog
const blogStructure = {
    title: '',
    banner: '',
    content: [],
    tags: [],
    des: '', 
    author: { personal_info: { } }
}

export const EditorContext = createContext({ });

const Editor = () => {
    // WE have to make this state so that it is parent file for Blog Editor page and Publish Draft page
    const [ blog, setBlog ] = useState(blogStructure)

    const [ editorState, setEditorState ] = useState("editor"); // to show blogEditor or PublishForm 

    let { userAuth: { access_token } } = useContext(UserContext);

    // EditorContext.Provider is like a component which has access to EditorContext of Context React Hook
    return (
        <>
         
            <EditorContext.Provider value={ {blog, setBlog, editorState, setEditorState} }>
                {
                    access_token === null ? 
                    <Navigate to="/signin" /> 
                    : editorState == "editor" ? 
                    <BlogEditor /> : <PublishForm />
                }
            </EditorContext.Provider>
        </>
    )
}

export default Editor;