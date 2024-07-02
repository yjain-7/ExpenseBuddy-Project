import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { InputBox } from "../components/InputBox";
import { useState } from "react";

export const Auth = ({ type }) => {
    return (
        <div>
            {type === "signup" ? (
                <Signup />
            ) : (
                <Login />
            )}
        </div>
    );
};

function Signup() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:block"><Card /></div>
            <div className="h-screen flex justify-center items-center lg:flex-col lg:h-auto">
                <div className="max-w-lg w-full px-4">
                    <div className="text-3xl font-extrabold text-center">
                        Create an Account
                    </div>
                    <div className="text-slate-400 flex justify-center pb-5 text-center">
                        Already have an account? 
                        <Link to="/login" className="pl-2 underline">Login</Link>
                    </div>
                    <InputBox label="First Name" placeholder="Enter your First Name" />
                    <InputBox label="Last Name" placeholder="Enter your Last Name" />
                    <InputBox label="Email Address" placeholder="Enter your Email Address" />
                    <InputBox label="Password" placeholder="Enter your Password" type="password" />
                    {/* Additional input boxes for other fields */}
                    <div className="flex justify-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


function Login() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-screen flex justify-center items-center lg:flex-col lg:h-auto">
                <div className="max-w-lg w-full px-4">
                    <div className="text-3xl font-extrabold text-center">
                        Login
                    </div>
                    <div className="text-slate-400 flex justify-center pb-5 text-center">
                        Don't have an account? 
                        <Link to="/signup" className="pl-2 underline">Signup</Link>
                    </div>
                    <InputBox label="Email Address" placeholder="Enter your Email Address" />
                    <InputBox label="Password" placeholder="Enter your Password" type="password" />
                    {/* Additional input boxes for other fields */}
                    <div className="flex justify-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Login
                        </button>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block"><Card /></div>
        </div>
    );
}
