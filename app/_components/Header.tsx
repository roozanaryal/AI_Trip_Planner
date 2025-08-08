import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

function Header() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      <div className="flex gap-2 items-center">
        <Image src={"/globe.svg"} alt="Logo" width={25} height={25} />
        <h2 className="font-bold text-2xl">Trip Planner</h2>
      </div>
      <div className="flex gap-8 items-center">
        {menuItems.map((menu, index) => (
          <Link 
            key={index} 
            href={menu.href}
            className="text-lg hover:scale-110 transition-all cursor-pointer"
          >
            {menu.label}
          </Link>
        ))}
      </div>
      <Button className="bg-blue-500 hover:bg-blue-600 text-white">
        Get Started
      </Button>
    </div>
  );
}

export default Header;
