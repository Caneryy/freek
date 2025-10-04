"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Marketplace",
    href: "/",
  },
  {
    label: "Customer View",
    href: "/customer",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-purple-900/30 shadow-md shadow-purple-500/20" : ""
              } hover:bg-purple-900/20 hover:shadow-md hover:shadow-purple-500/20 focus:!bg-purple-900/30 active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col transition-all`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 shrink-0 justify-between z-20 shadow-lg shadow-purple-900/30 border-b border-purple-900/20 px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="ml-1 btn btn-ghost lg:hidden hover:bg-transparent">
            <Bars3Icon className="h-1/2" />
          </summary>
          <ul
            className="menu menu-compact dropdown-content mt-3 p-2 shadow-sm bg-base-100 rounded-box w-52"
            onClick={() => {
              burgerMenuRef?.current?.removeAttribute("open");
            }}
          >
            <HeaderMenuLinks />
          </ul>
        </details>
        <Link href="/" passHref className="flex lg:hidden items-center gap-2 ml-2 mr-4 shrink-0">
          <Image src="/logo2.jpeg" alt="FREEK Logo" width={32} height={32} className="w-8 h-8 rounded-lg" />
          <span className="font-black text-lg leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500">
            FREEK
          </span>
        </Link>
        <Link href="/" passHref className="hidden lg:flex items-center gap-3 ml-4 mr-6 shrink-0">
          <Image src="/logo2.jpeg" alt="FREEK Logo" width={40} height={40} className="w-10 h-10 rounded-lg" />
          <div className="flex flex-col">
            <span className="font-black text-xl leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500">
              FREEK
            </span>
            <span className="text-xs text-purple-400 font-semibold tracking-wide">NFT&apos;lerinizi Hissedin</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end grow mr-4">
        <RainbowKitCustomConnectButton />
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};
