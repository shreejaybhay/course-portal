"use client"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
// src/components/Navbar.js
import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="p-4 bg-gray-800">
            <div className="container flex items-center justify-between mx-auto">
                <Link href="/" className="text-2xl font-bold text-white">
                    LOGO
                </Link>
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none"
                    >
                        <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                    </button>
                </div>
                <SignedIn className={`w-full md:flex md:items-center md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex items-center md:flex md:space-x-8">
                        <li>
                            <Link href="/" className="block px-4 py-2 text-white rounded hover:bg-gray-700" onClick={toggleMenu}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/courses" className="block px-4 py-2 text-white rounded hover:bg-gray-700" onClick={toggleMenu}>
                                courses
                            </Link>
                        </li>
                        <li className="gap-2 cursor-pointer ">
                            <UserButton afterSignOutUrl="/" />
                        </li>
                    </ul>
                </SignedIn>
                <SignedOut>
                    <ul className="md:flex md:space-x-8">
                        <li>
                            <Link href="/" className="block px-4 py-2 text-white rounded hover:bg-gray-700" onClick={toggleMenu}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/courses" className="block px-4 py-2 text-white rounded hover:bg-gray-700" onClick={toggleMenu}>
                                courses
                            </Link>
                        </li>
                        <li>
                            <Link href="/sign-in" className="block px-4 py-2 text-white rounded hover:bg-gray-700" onClick={toggleMenu}>
                                Sign In
                            </Link>
                        </li>
                        <li>
                            <Link href="/sign-up" className="block px-4 py-2 text-white bg-blue-600 rounded hover:bg-gray-700" onClick={toggleMenu}>
                                Sign Up
                            </Link>
                        </li>
                    </ul>
                </SignedOut>
            </div>
        </nav>
    );
};

export default Navbar;