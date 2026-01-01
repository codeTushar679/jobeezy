"use client";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo1.png"
                alt="jobeezy logo"
                width={50}
                height={50}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-2xl font-semibold text-gray-900">
                Jobeezy
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/aichatbot"
              className={` ${
                pathname === "/aichatbot" ? "text-orange-600" : "text-gray-600"
              } px-3 py-2 rounded-md font-medium`}
            >
              AI Chatbot
            </Link>
            <Link
              href="/jobs"
              className={` ${
                pathname === "/jobs" ? "text-orange-600" : "text-gray-600"
              } px-3 py-2 rounded-md font-medium`}
            >
              Browse Jobs
            </Link>
            <Link
              href="/jobs/post"
              className={`${
                pathname === "/jobs/post" ? "text-orange-600" : "text-gray-600"
              } px-3 py-2 rounded-md font-medium`}
            >
              Post Job
            </Link>
            <Link
              href="/dashboard"
              className={`${
                pathname === "/dashboard" ? "text-orange-600" : "text-gray-600"
              } px-3 py-2 rounded-md font-medium`}
            >
              Dashboard
            </Link>
            <SignedOut>
              <SignUpButton>
                <button className="text-gray-600 hover:cursor-pointer hover:text-gray-900 px-3 py-2 rounded-md font-medium">
                  Sign In
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
