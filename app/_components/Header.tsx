import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SignInButton, useUser } from "@clerk/nextjs";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

function Header() {
  const { user } = useUser();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Image src={"/globe.svg"} alt="Logo" width={18} height={18} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            AI Trip Planner
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary hover:scale-125 transition-all duration-200"
            >
              {menu.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          {user ? (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-200 transform-gpu active:scale-95 shadow-md hover:shadow-lg">
              <span className="relative group">
                <span className="absolute -inset-0.5 bg-primary-foreground/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-200"></span>
                <span className="relative">Create Trip</span>
              </span>
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-200 transform-gpu active:scale-95 shadow-md hover:shadow-lg">
                <span className="relative group">
                  <span className="absolute -inset-0.5 bg-primary-foreground/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-200"></span>
                  <span className="relative">Get Started</span>
                </span>
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
