import { useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const UserAuthForm = ({type}) => {

    const authForm = useRef();

    const userAuthThroughServer = (serverRoute, formData) => {
        // send data to server
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type === "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        // formData
        let form = new FormData(authForm.current);
        let formData = {};

        for(let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let {fullname, email, password} = formData;
        // form validation
        if(fullname) {
            if(fullname.length < 3) {
                return toast.error("Fullname must be at least 3 characters long");
            }
        }
        if(!email.length) {
            return toast.error("Email must be entered");
        }
        if(!emailRegex.test(email)) {
            return toast.error("Invalid email");
        }
        if(!passwordRegex.test(password)) {
            return toast.error("Password must contain 6 to 20 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number");
        }

        // send data to backend
        userAuthThroughServer(serverRoute, formData);
    }

    return (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
            <Toaster/>
            <form ref={authForm} className="w-[80%] max-w-[400px]">
                <h1 className="text-4xl font-gelasio capitalize text-center mb24">
                    {type === "sign-in" ? "Welcome back" : "Join us today"}
                </h1>

                {
                    type !== "sign-in" ?
                    <InputBox
                        name="fullname"
                        type="text"
                        placeholder="Full Name"
                        icon = "fi-rr-user"
                    />
                    :
                    ""
                }

                <InputBox
                    name="email"
                    type="email"
                    placeholder="Email"
                    icon = "fi-rr-envelope"
                />

                <InputBox
                    name="password"
                    type="password"
                    placeholder="Password"
                    icon = "fi-rr-key"
                />

                {/* Sign in and sign up button */}

                <button
                    className="btn-dark center mt14"
                    type="submit"
                    onClick={handleSubmit}
                >
                    {type.replace("-", " ")}
                </button>

                <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                    <hr className="w-1/2 border-black"/>
                    <p>or</p>
                    <hr className="w-1/2 border-black"/>
                </div>

                <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                    <img src={googleIcon} alt="Google Icon" className="w-5"/>
                    Continue with google
                </button>

                {
                    type === "sign-in" ?
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Don't have an account ?
                        <Link to="/signup" className="underline text-black text-xl ml-1">
                            Join us today
                        </Link>
                    </p>
                    :
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Already a member ?
                        <Link to="/signin" className="underline text-black text-xl ml-1">
                            Sign in here
                        </Link>
                    </p>
                }

            </form>
            </section>
        </AnimationWrapper>
    )
}

export default UserAuthForm;

// type is a prop that is passed to the UserAuthForm component. It is used to determine the type of form to be displayed. If the type is "sign-in", the form will display a sign-in form. If the type is "sign-up", the form will display a sign-up form.