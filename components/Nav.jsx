"use client";

import Link from "@node_modules/next/link";
import Image from "@node_modules/next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from '@node_modules/next-auth/react'

const Nav = () => {
  const { data: session } = useSession();
  const isUserLoggedIn = !!session?.user;
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    }
    setUpProviders();
  }, []);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image 
          src="assets/images/logo.svg" 
          width={30} 
          height={30} 
          className="object-contain"
          alt="logo"
        />
        <p className="logo_text">Promtopia</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {isUserLoggedIn ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" 
            className="black_btn">
              Create Post
            </Link>
            <button type="button" onClick={signOut} className="outline_btn">Sign out</button>

            <Link href="/profile">
              <Image 
                src={session?.user.image}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"/>
            </Link>
          </div>
        ) : (
          <>
            {providers && 
              Object.values(providers).map((provider) => (
                <button 
                  type="button" 
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
            ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {isUserLoggedIn ? (
          <div className="flex">
            <Image 
              src={session?.user.image}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
            
            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown (false)}>
                    My Profile
                </Link>
                <Link
                  href="/create-prompt"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown (false)}>
                    Create Prompt
                </Link>
                <button 
                  type="button" 
                  className="mt-5 w-full black_btn"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  >
                    Sign Out
                  </button>
              </div>
            )}

          </div>
        ):(
          <>
            {providers && 
              Object.values(providers).map((provider) => (
                <button 
                  type="button" 
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
            ))}
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav