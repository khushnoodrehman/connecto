import { useReducer } from "react";
import Logo from "../../components/ui/Logo/Logo.jsx";
import { Link, redirect, useNavigate } from 'react-router-dom'
import "./Signup.css"

const initialState = {
    firstName: "",
    surname: "",
    username: "",
    dob: "",
    gender: "",
    email: "",
    password: { value: "", isTouched: false },
    confirmPassword: { value: "", isTouched: false }
};

const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_FIELD":
            if (action.field === "password" || action.field === "confirmPassword") {
                return {
                    ...state,
                    [action.field]: {
                        ...state[action.field],
                        value: action.value
                    }
                };
            }
            return {
                ...state,
                [action.field]: action.value
            };

        case "BLUR":
            return {
                ...state,
                [action.field]: {
                    ...state[action.field],
                    isTouched: true
                }
            };

        case "RESET_FORM":
            return initialState;

        default:
            return state;
    }
};


const PasswordErrorMessage = ({ children }) => {
    return <>{children}</>;
};

const Signup = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: "UPDATE_FIELD", field: name, value });
    };

    const handlePasswordBlur = (e) => {
        const { name } = e.target;
        dispatch({ type: "BLUR", field: name });
    };

    const validateForm = () => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
        return (
            state.firstName.trim() !== "" &&
            state.surname.trim() !== "" &&
            isEmailValid &&
            state.username &&
            state.dob !== "" &&
            state.gender !== "" &&
            state.password.value.length >= 8 &&
            state.password.value === state.confirmPassword.value
        );
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert("Please fill the form correctly.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/signup", {
                method: "POST",
                body: JSON.stringify(state),
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            })

            const data = await response.json()
            console.log(data)

            if (data.success) {
                navigate('/feed');
            }
        } catch (e) {
            console.log("Error: " + e);
        }
        console.log("Form Submitted:", state);
        dispatch({ type: "RESET_FORM" });
    };


    return (
        <div className="Signup">
            <div className="header">
                <Logo size="lg" />
                <br />
                <p>Join Connecto and start connecting</p>
            </div>

            <div className="SignupCard">
                <div className="cardHeader">
                    <span>Create a new account</span>
                    <p>It's quick and easy.</p>
                </div>

                <hr />

                <form onSubmit={handleSubmit}>
                    <div className="name-fields">
                        <input
                            className="name-fields"
                            type="text"
                            name="firstName"
                            value={state.firstName}
                            placeholder="First Name"
                            onChange={handleChange}
                        />

                        <input
                            className="name-fields"
                            type="text"
                            name="surname"
                            value={state.surname}
                            placeholder="Surname"
                            onChange={handleChange}
                        />
                    </div>

                    <input
                        type="username"
                        name="username"
                        value={state.username}
                        placeholder="Username"
                        onChange={handleChange}
                    />


                    <input
                        type="date"
                        name="dob"
                        value={state.dob}
                        onChange={handleChange}
                    />

                    <div className="gender-options">
                        <label className={`gender-option ${state.gender === 'female' ? 'gender-option--selected' : ''}`}>
                            Female
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={state.gender === "female"}
                                onChange={handleChange}
                            />
                        </label>

                        <label className={`gender-option ${state.gender === 'male' ? 'gender-option--selected' : ''}`}>
                            Male
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={state.gender === "male"}
                                onChange={handleChange}
                            />
                        </label>

                        <label className={`gender-option ${state.gender === 'custom' ? 'gender-option--selected' : ''}`}>
                            Custom
                            <input
                                type="radio"
                                name="gender"
                                value="custom"
                                checked={state.gender === "custom"}
                                onChange={handleChange}
                            />
                        </label>

                    </div>
                    <input
                        type="email"
                        name="email"
                        value={state.email}
                        placeholder="Email address"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        value={state.password.value}
                        placeholder="New password"
                        onChange={handleChange}
                        onBlur={handlePasswordBlur}
                    />
                    {state.password.isTouched && state.password.value.length < 8 && (
                        <PasswordErrorMessage>
                            <p className="FieldError">
                                Password should be at least 8 characters long
                            </p>
                        </PasswordErrorMessage>
                    )}

                    <input
                        type="password"
                        name="confirmPassword"
                        value={state.confirmPassword.value}
                        placeholder="Confirm password"
                        onChange={handleChange}
                        onBlur={handlePasswordBlur}
                    />
                    {state.confirmPassword.isTouched &&
                        state.confirmPassword.value !== state.password.value ? (
                        <PasswordErrorMessage>
                            <p className="FieldError">
                                Password and Confirm password must be same!
                            </p>
                        </PasswordErrorMessage>
                    ) : (
                        state.confirmPassword.value !== "" && state.confirmPassword.isTouched && (
                            <PasswordErrorMessage>
                                <p className="FieldError" style={{ color: "green" }}>Looks good!</p>
                            </PasswordErrorMessage>
                        )
                    )}

                    <p className="info-text">
                        People who use our service may have uploaded your contact information to Connecto. <a href="#">Learn more.</a>
                    </p>
                    <p className="info-text">
                        By clicking Sign Up, you agree to our <a href="#">Terms</a>, <a href="#">Privacy Policy</a> and <a href="#">Cookies Policy</a>. You may receive SMS notifications from us and can opt out at any time.
                    </p>

                    <button type="submit" disabled={!validateForm()}>
                        Signup
                    </button>

                    <Link to='/login' className='login-link'><p className="login-link">Already have an account?</p></Link>
                </form>
            </div>
            <br />
        </div>
    );
};

export default Signup;
