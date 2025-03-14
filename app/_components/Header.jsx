"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <div className="flex flex-row items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Image src={"/budget.png"} alt="logo" width={40} height={25} />
            <span className="text-blue-800 font-bold text-xl">SmartBudget AI</span>
          </div>
        </Link>
      </div>
      <div className="flex gap-3 items-center">
        {isSignedIn ? (
          <>
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-full">
                Go to Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button variant="outline" className="rounded-full">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="rounded-full">Get Started</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
