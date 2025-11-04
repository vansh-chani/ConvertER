"use client";
import { useState } from 'react';
import logo from '@/assets/logo.svg';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface FormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
}

export default function SignUpPage() {
    const [stage, setStage] = useState<number>(0);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const newErrors: FormErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setStage(1);
        console.log('Email submitted:', formData.email);
    };

    const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const newErrors: FormErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        try {
            const params = new URLSearchParams({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            const response = await fetch(`${API_BASE_URL}/auth/signup?${params.toString()}`, {
                method: 'POST',
            });


            const data = await response.json();

            if (!response.ok) {
                setErrors({ username: data.detail || 'Signup failed' });
                return;
            }

            localStorage.setItem('authToken', data.access_token);

            window.location.href = '/library';

        } catch (error) {
            console.error('Signup error:', error);
            setErrors({ username: 'Network error. Please try again.' });
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div
            className="
        grid
        h-screen w-screen
        grid-cols-1 grid-rows-[55px_auto_auto]
        bg-white
        md:grid-cols-[14%_72%_14%]
        md:grid-rows-[55px_auto]
      "
        >
            <div className="p-4 hidden md:block"></div>
            <div className="outline-[0.5px] outline-[#a1a1a1] p-4 flex items-center justify-start">
                <Image src={logo} alt="Logo" className="h-8" />
            </div>
            <div className=" p-4 hidden md:block"></div>
            <div className="outline-[0.5px] outline-[#a1a1a1] -outline-offset-1 p-4 hidden md:block"></div>
            <div className="flex flex-col items-center bg-[url('@/assets/bg-pattern.svg')] bg-repeat bg-[length:60px_60px] pt-15 md:pt-30">
                <div className='border border-[#c3c3c3] border-dashed [border-style:dashed] [border-width:2px] [border-dasharray:8] px-12 py-7 mx-4 bg-white'>
                    {stage === 0 ? (
                        <div className='transition-all duration-300 ease-in-out'>
                            <h1 className="mb-4 text-[24px] font-bold font-instrument-sans text-black md:text-[40px]">New here? - <span className="bg-gradient-to-r from-[#343434] to-[#666666] bg-clip-text text-transparent">Sign Up</span></h1>
                            <form className="flex flex-col gap-4" onSubmit={handleEmailSubmit}>
                                <p className='font-instrument-sans font-semibold text-[#686868] text-[16px]'>Enter your email to create an account.</p>
                                <p className='font-instrument-sans font-medium text-black text-[14px]'>Email</p>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="border border-[#686868] p-2 mb-8 h-9 rounded-[6px] font-jetbrains-mono outline-none focus:ring focus:ring-black text-black"
                                />
                                {errors.email && <p className="text-red-500 text-sm -mt-6 mb-4">{errors.email}</p>}
                                <div className='flex flex-col justify-center items-center'>
                                    <button type="submit" className="bg-[#333333] rounded-[6px] w-[156px] text-white p-2 mb-8 font-bold text-sm hover:opacity-80 hover:cursor-pointer">Continue</button>
                                    <p className='font-instrument-sans font-medium text-[#686868] text-[14px]'>Already have an account? <button onClick={() => {
                                        window.location.href = '/login';
                                    }} type="button" className='text-[#686868] font-medium hover:cursor-pointer'><u>Log In</u></button></p>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <h1 className="mb-4 text-[24px] font-bold font-instrument-sans text-black md:text-[40px]">New here? - <span className="bg-gradient-to-r from-[#343434] to-[#666666] bg-clip-text text-transparent">Sign Up</span></h1>
                            <form className="flex flex-col gap-4" onSubmit={handleSignUpSubmit}>
                                <p className='font-instrument-sans font-semibold text-[#686868] text-[16px]'>Create a username and password</p>
                                <p className='font-instrument-sans font-medium text-black text-[14px]'>Username</p>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="border border-[#686868] p-2 h-9 rounded-[6px] font-jetbrains-mono outline-none focus:ring focus:ring-black text-black"
                                />
                                {errors.username && <p className="text-red-500 text-sm -mt-2">{errors.username}</p>}
                                <p className='font-instrument-sans font-medium text-black text-[14px]'>Password</p>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="border border-[#686868] p-2 h-9 rounded-[6px] font-jetbrains-mono outline-none focus:ring focus:ring-black text-black"
                                />
                                {errors.password && <p className="text-red-500 text-sm -mt-2">{errors.password}</p>}
                                <p className='font-instrument-sans font-medium text-black text-[14px]'>Confirm Password</p>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="border border-[#686868] p-2 mb-8 h-9 rounded-[6px] font-jetbrains-mono outline-none focus:ring focus:ring-black text-black"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm -mt-6 mb-4">{errors.confirmPassword}</p>}
                                <div className='flex flex-col justify-center items-center'>
                                    <button type="submit" className="bg-[#333333] rounded-[6px] w-[156px] text-white p-2 mb-8 font-bold text-sm hover:opacity-80 hover:cursor-pointer">Sign Up</button>
                                    <p className='font-instrument-sans font-medium text-[#686868] text-[14px]'>Already have an account? <button onClick={() => {
                                        window.location.href = '/login';
                                    }} type="button" className='text-[#686868] font-medium hover:cursor-pointer'><u>Log In</u></button></p>
                                </div>
                            </form>
                        </>
                    )
                    }
                </div>
            </div>
            <div className="outline-[0.5px] outline-[#a1a1a1] -outline-offset-1 p-4 hidden md:block"></div>
            <div className="p-4 hidden md:block"></div>
            <div className="outline-[0.5px] outline-[#a1a1a1] p-4 hidden md:block"></div>
            <div className="p-4 hidden md:block"></div>
        </div >
    );
}