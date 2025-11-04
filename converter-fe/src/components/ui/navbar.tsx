"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.svg";

export default function Navbar({ page }: { page: string }) {
    const [currentPage, setCurrentPage] = useState(page);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setLoggedIn(!!token);
    }, []);

    const goTo = (path: string) => {
        setCurrentPage(path);
        window.location.href = path === "home" ? "/" : "/library";
    };

    const linkClasses = (p: string) =>
        `text-sm font-instrument-sans font-medium hover:cursor-pointer transition ${currentPage === p ? "text-black" : "text-[#7b7b7b]"
        }`;

    return (
        <div className="outline-[0.5px] outline-[#a1a1a1] p-4 flex items-center justify-between">
            <Image src={logo} alt="Logo" className="h-8" />

            <div className="flex flex-row justify-center items-center gap-4">

                <p className={linkClasses("home")} onClick={() => goTo("home")}>
                    Home
                </p>

                {loggedIn && (
                    <p className={linkClasses("library")} onClick={() => goTo("library")}>
                        Library
                    </p>
                )}

                {!loggedIn && (
                    <button
                        className="text-sm font-instrument-sans font-medium text-[#7b7b7b] hover:cursor-pointer"
                        onClick={() => (window.location.href = "/login")}
                    >
                        Login
                    </button>
                )}

                {loggedIn && (
                    <button
                        className="text-sm font-instrument-sans font-medium px-4 py-1 rounded-[6px] text-white bg-[#333333] hover:cursor-pointer"
                        onClick={() => {
                            localStorage.removeItem("authToken");
                            window.location.href = "/";
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
}
