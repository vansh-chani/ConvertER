"use client";
import { useState } from 'react';
import logo from '@/assets/logo.svg';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface FormData {
    username: string;
    password: string;
}

interface FormErrors {
    username?: string;
    password?: string;
}

export default function LoginPage() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const newErrors: FormErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            const formDataToSend = new URLSearchParams();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('password', formData.password);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDataToSend.toString(),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setErrors({ password: 'Invalid username or password' });
                } else if (response.status === 404) {
                    setErrors({ username: 'User not found' });
                } else {
                    setErrors({ username: data.detail || 'Login failed' });
                }
                return;
            }

            localStorage.setItem('authToken', data.access_token);

            console.log('Login successful!');

            window.location.href = '/library';

        } catch (error) {
            console.error('Login error:', error);
            setErrors({ username: 'Network error. Please try again.' });
        }
    };

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
            <div className="p-4"></div>
            <div className="outline-[0.5px] outline-[#a1a1a1] p-4 flex items-center justify-start">
                <Image src={logo} alt="Logo" className="h-8" />
            </div>
            <div className=" p-4"></div>
            <div className="outline-[0.5px] outline-[#a1a1a1] -outline-offset-1 p-4"></div>
            <div className="flex flex-col items-center bg-[url('@/assets/bg-pattern.svg')] bg-repeat bg-[length:60px_60px] pt-30">
                <div className='border border-[#c3c3c3] border-dashed [border-style:dashed] [border-width:2px] [border-dasharray:8] ml-1 px-14 py-7 bg-white'>

                    <h1 className="mb-4 text-[40px] font-bold font-instrument-sans text-black">Welcome back - <span className="bg-gradient-to-r from-[#343434] to-[#666666] bg-clip-text text-transparent">Login</span></h1>
                    <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
                        <p className='font-instrument-sans font-semibold text-[#686868] text-[16px]'>Enter your username to login into your account.</p>
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
                        <div className='flex flex-col justify-center items-center'>
                            <button type="submit" className="bg-[#333333] rounded-[6px] w-[156px] text-white p-2 mb-8 font-bold text-sm hover:opacity-80 hover:cursor-pointer">Log In</button>
                            <p className='font-instrument-sans font-medium text-[#686868] text-[14px]'>Don't have an account yet? <button onClick={() => {
                                window.location.href = '/signup';
                            }} type="button" className='text-[#686868] font-medium hover:cursor-pointer'><u>Sign Up</u></button></p>
                        </div>
                    </form>

                </div>
            </div>
            <div className="outline-[0.5px] outline-[#a1a1a1] -outline-offset-1 p-4"></div>
            <div className="p-4"></div>
            <div className="outline-[0.5px] outline-[#a1a1a1] p-4"></div>
            <div className="p-4"></div>
        </div >
    );
}