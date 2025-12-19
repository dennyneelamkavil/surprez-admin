"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useSession, signOut } from "next-auth/react";
import { hasPermission } from "@/lib/authorization";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function UserDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  if (!session?.user) return null;

  const { username, role } = session.user;

  async function handleSignOut() {
    const toastId = toast.loading("Signing out...");

    await signOut({ callbackUrl: "/auth/sign-in" });

    toast.update(toastId, {
      render: "Signed out successfully",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  }

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={44}
            height={44}
            src="/images/user/owner.jpg"
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">{username}</span>

        <svg
          className={`stroke-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg"
      >
        {/* User info */}
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm">
            {username}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500">
            {role.name}
          </span>
        </div>

        {/* Menu */}
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm hover:bg-gray-100"
            >
              <UserCircle size={20} />
              Edit profile
            </DropdownItem>
          </li>

          {/* 🔐 Permission-based menu example */}
          {/* {hasPermission(role, "user:read") && (
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                tag="a"
                href="/users"
                className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm hover:bg-gray-100"
              >
                Manage Users
              </DropdownItem>
            </li>
          )} */}

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm hover:bg-gray-100"
            >
              <Settings size={20} />
              Settings
            </DropdownItem>
          </li>
        </ul>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium rounded-lg text-theme-sm hover:bg-gray-100"
        >
          <LogOut size={20} />
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
