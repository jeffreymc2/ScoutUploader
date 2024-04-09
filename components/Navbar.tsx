import React, { Suspense, lazy } from "react";
import { Dialog } from "@headlessui/react";
import getUserSession from "@/lib/getUserSession";
import { supabaseServer } from "@/lib/supabase/server";
import { useRouter } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import NavbarSkeleton from "./NavbarSkeleton";
import Link from "next/link";
import MobileMenu from "./MobileNav";
import { useNavigation } from "react-day-picker";

const navigation = [
  { name: "Events", href: "/events" },
  { name: "Players", href: "/players" },
];

export default async function Navbar() {
  const { data } = await getUserSession();


  const logoutAction = async () => {
    "use server";
    const supabase = await supabaseServer();
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-gradient-to-tl from-blue-500 to-blue-700 border-blue-500 border-b-2">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <a href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Perfect Game</span>
          <PerfectGameLogo />
        </a>

        <div className="hidden lg:flex lg:gap-x-12">
          <>
            {navigation.map((item) => {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-gray-100"
                >
                  {item.name}
                </a>
              );
            })}
          </>

          <ul>
            {!data.session && (
              <>
                <li>
                  <Button className="relative -mt-2 px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800">
                    <Link href="/login" className="">
                      Login
                    </Link>
                  </Button>
                </li>
              </>
            )}
            {data.session && (
              <form action={logoutAction} className="flex">
                <li>
                  <Link href="/">
                  <Button className="relative -mt-2 px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800">
                    Logout
                  </Button>
                  </Link>
                </li>
              </form>
            )}
          </ul>
        </div>
        <MobileMenu session={data.session} />
      </nav>
    </header>
  );
}

function PerfectGameLogo() {
  const svgStyle = {
    fill: "var(--color-svg-fill)",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="190"
      height="32"
      viewBox="0 0 195 32"
      fill="none"
    >
      <path
        d="M24.25 5.37047H20.21V5.44047C20.21 6.34047 21.41 6.91047 21.54 6.97047C21.62 7.03047 21.66 7.11047 21.67 7.20047C21.64 7.27047 21.59 7.34047 21.54 7.40047C20.51 7.97047 20.24 8.63047 20.24 8.67047V8.74047H23.64C24.37 9.57047 25.41 10.5705 25.41 10.5705L25.51 10.6705V4.23047L24.24 5.36047L24.25 5.37047Z"
        fill="#ffffff"
      />
      <path
        d="M20.51 7.14C20.51 7.14 19.41 6.47 19.28 5.74V3.37C19.23 2.78 19.03 2.2 18.71 1.7C18.24 0.93 17.24 0 15.17 0H0L1.63 1.83V12.27C1.56 12.94 0.46 13.64 0.46 13.64H0.39L0.46 13.71C0.96 13.98 1.56 14.84 1.63 14.94V25.05L0.4 26.62H6.84L5.44 25.05V15.01H7.71V11.64H5.44V3.44H13.91C15.51 3.44 15.54 5.41 15.54 5.44V9.64C15.51 11.41 13.54 11.64 13.47 11.64H13.44V15.01H15.61C16.74 15.01 17.68 14.71 18.28 14.14C18.93 13.5 19.29 12.62 19.28 11.71V8.71C19.31 8.61 19.81 7.58 20.51 7.21V7.14Z"
        fill="#ffffff"
      />
      <path
        d="M18.7401 18.5104L20.6701 20.1404V28.4404H13.8001C13.0801 28.4804 12.4701 27.9303 12.4301 27.2104C12.4301 27.1903 12.4301 27.1604 12.4301 27.1404V20.6004C12.6001 19.6004 13.6301 18.9704 13.6301 18.9704L13.7001 18.9004H13.6301C12.4301 18.4004 12.4301 17.4304 12.4301 17.4004V9.80035C12.2301 8.63035 14.4301 8.73035 14.5001 8.73035V5.36035H12.3701C10.6401 5.66035 9.74005 6.56035 9.30005 7.26035C9.00005 7.69035 8.79005 8.18035 8.70005 8.69035V17.1904C8.60005 18.2604 7.50005 18.8604 7.50005 18.8604L7.43005 18.9304H7.50005C8.10005 19.2204 8.53005 19.7604 8.70005 20.4004V28.5004C8.70005 30.2004 9.83005 31.0304 10.8001 31.4304C11.4701 31.6804 12.1801 31.8204 12.9001 31.8604H24.7401V20.2204C24.7701 19.8904 25.5101 18.5504 25.5101 18.5204L18.7401 18.4904V18.5104Z"
        fill="#ffffff"
      />
      <path
        d="M194.31 24.0502V22.2202C194.35 21.9502 194.16 21.6902 193.89 21.6502C193.84 21.6502 193.79 21.6502 193.75 21.6502H188.11C187.96 21.6702 187.83 21.5702 187.81 21.4202C187.81 21.4002 187.81 21.3702 187.81 21.3502V17.6102C187.79 17.4602 187.89 17.3302 188.04 17.3102C188.06 17.3102 188.09 17.3102 188.11 17.3102H192.75C193.02 17.3502 193.28 17.1602 193.32 16.8902C193.32 16.8402 193.32 16.7902 193.32 16.7502V14.9202C193.36 14.6502 193.17 14.3902 192.9 14.3502C192.85 14.3502 192.8 14.3502 192.76 14.3502H188.12C187.97 14.3702 187.84 14.2702 187.82 14.1202C187.82 14.1002 187.82 14.0702 187.82 14.0502V10.5502C187.8 10.4002 187.9 10.2702 188.05 10.2502C188.07 10.2502 188.1 10.2502 188.12 10.2502H193.76C194.03 10.2902 194.29 10.1002 194.33 9.8302C194.33 9.7802 194.33 9.7302 194.33 9.6902V7.8602C194.37 7.5902 194.18 7.3302 193.91 7.2902C193.86 7.2902 193.81 7.2902 193.77 7.2902H184.97C184.7 7.2502 184.44 7.4402 184.4 7.7102C184.4 7.7602 184.4 7.8102 184.4 7.8502V24.0602C184.36 24.3302 184.55 24.5902 184.82 24.6302C184.87 24.6302 184.92 24.6302 184.96 24.6302H193.76C194.03 24.6702 194.29 24.4802 194.33 24.2102C194.33 24.1602 194.33 24.1102 194.33 24.0702M176.22 7.6602L173.32 17.2002H173.15L170.32 7.6602C170.25 7.4302 170.03 7.2802 169.79 7.2902H165.79C165.52 7.2502 165.26 7.4402 165.22 7.7102C165.22 7.7602 165.22 7.8102 165.22 7.8502V24.0602C165.18 24.3302 165.37 24.5902 165.64 24.6302C165.69 24.6302 165.74 24.6302 165.78 24.6302H167.98C168.27 24.6502 168.53 24.4302 168.55 24.1302C168.55 24.1102 168.55 24.0802 168.55 24.0602V11.2502H168.65L171.45 20.3202C171.53 20.6402 171.82 20.8602 172.15 20.8502H174.42C174.74 20.8502 175.02 20.6302 175.09 20.3202L177.82 11.2802H177.92V24.0502C177.88 24.3202 178.07 24.5802 178.34 24.6202C178.39 24.6202 178.44 24.6202 178.48 24.6202H180.71C180.98 24.6602 181.24 24.4702 181.28 24.2002C181.28 24.1502 181.28 24.1002 181.28 24.0602V7.8402C181.32 7.5702 181.13 7.3102 180.86 7.2702C180.81 7.2702 180.76 7.2702 180.72 7.2702H176.72C176.42 7.2702 176.25 7.4002 176.22 7.6402M156.41 10.5402L158.08 17.2802H154.61L156.31 10.5402H156.41ZM152.77 24.4802C152.87 24.3602 152.93 24.2002 152.94 24.0502L153.91 20.2502H158.78L159.71 24.0502C159.71 24.2102 159.78 24.3602 159.88 24.4802C159.95 24.5802 160.08 24.6102 160.28 24.6102H162.88C163.21 24.6102 163.31 24.4102 163.21 24.0402L158.94 7.8302C158.86 7.4602 158.51 7.2202 158.14 7.2602H154.54C154.17 7.2302 153.83 7.4702 153.74 7.8302L149.47 24.0402C149.37 24.4102 149.47 24.6102 149.8 24.6102H152.37C152.57 24.6102 152.7 24.5802 152.77 24.4802ZM146.57 23.4802C147.34 22.7102 147.74 21.6102 147.74 20.2102V14.9702C147.74 14.5702 147.54 14.3702 147.11 14.3702H142.41C142.01 14.3702 141.84 14.5402 141.84 14.9402V16.7702C141.8 17.0402 141.99 17.3002 142.26 17.3402C142.31 17.3402 142.36 17.3402 142.4 17.3402H144C144.15 17.3202 144.28 17.4202 144.3 17.5702C144.3 17.5902 144.3 17.6202 144.3 17.6402V20.0402C144.3 20.6402 144.2 21.0402 143.97 21.2702C143.62 21.5502 143.18 21.6802 142.74 21.6402H141.01C140.58 21.6802 140.15 21.5502 139.81 21.2702C139.54 21.0402 139.44 20.6402 139.44 20.0402V11.8402C139.44 11.2402 139.54 10.8402 139.81 10.6102C140.15 10.3402 140.58 10.2002 141.01 10.2402H142.74C143.18 10.2002 143.63 10.3302 143.97 10.6102C144.2 10.8402 144.3 11.2402 144.3 11.8402V12.1402C144.3 12.5402 144.5 12.7402 144.87 12.7402H147.17C147.54 12.7402 147.74 12.5402 147.74 12.1402V11.6702C147.74 10.2702 147.34 9.1702 146.57 8.4002C145.8 7.6302 144.7 7.2702 143.3 7.2702H140.47C139.04 7.2702 137.94 7.6402 137.17 8.4002C136.4 9.1602 136 10.2302 136 11.6702V20.2102C136 21.6402 136.4 22.7102 137.17 23.4802C137.94 24.2502 139.04 24.6102 140.47 24.6102H143.3C144.7 24.6102 145.8 24.2402 146.57 23.4802ZM124.46 24.0502V10.5402C124.44 10.3902 124.54 10.2602 124.69 10.2402C124.71 10.2402 124.74 10.2402 124.76 10.2402H127.86C128.13 10.2802 128.39 10.0902 128.43 9.8202C128.43 9.7702 128.43 9.7202 128.43 9.6802V7.8502C128.47 7.5802 128.28 7.3202 128.01 7.2802C127.96 7.2802 127.91 7.2802 127.87 7.2802H117.66C117.39 7.2402 117.13 7.4302 117.09 7.7002C117.09 7.7502 117.09 7.8002 117.09 7.8402V9.6702C117.05 9.9402 117.24 10.2002 117.51 10.2402C117.56 10.2402 117.61 10.2402 117.65 10.2402H120.72C120.87 10.2202 121 10.3202 121.02 10.4702C121.02 10.4902 121.02 10.5202 121.02 10.5402V24.0502C121.02 24.4202 121.22 24.6202 121.62 24.6202H123.89C124.16 24.6602 124.42 24.4702 124.46 24.2002C124.46 24.1502 124.46 24.1002 124.46 24.0602M114.79 23.4902C115.59 22.7202 115.99 21.6202 115.99 20.2202V18.9502C116.03 18.6602 115.82 18.3902 115.53 18.3502C115.48 18.3502 115.43 18.3502 115.39 18.3502H113.12C112.72 18.3502 112.55 18.5502 112.55 18.9502V20.0502C112.59 20.4902 112.46 20.9402 112.18 21.2802C111.83 21.5502 111.39 21.6802 110.95 21.6502H109.12C108.69 21.6902 108.26 21.5602 107.92 21.2802C107.64 20.9302 107.51 20.4902 107.55 20.0502V11.8502C107.51 11.4102 107.64 10.9602 107.92 10.6202C108.26 10.3502 108.69 10.2102 109.12 10.2502H110.95C111.39 10.2102 111.83 10.3402 112.18 10.6202C112.46 10.9702 112.59 11.4102 112.55 11.8502V12.9502C112.55 13.3502 112.72 13.5502 113.12 13.5502H115.39C115.68 13.5902 115.95 13.3802 115.99 13.0902C115.99 13.0402 115.99 12.9902 115.99 12.9502V11.6802C115.99 10.2802 115.59 9.1802 114.79 8.4102C113.99 7.6402 112.92 7.2802 111.52 7.2802H108.59C107.16 7.2802 106.06 7.6502 105.29 8.4102C104.52 9.1702 104.12 10.2402 104.12 11.6802V20.2202C104.12 21.6502 104.52 22.7202 105.29 23.4902C106.06 24.2602 107.16 24.6202 108.59 24.6202H111.52C112.92 24.6202 114.02 24.2502 114.79 23.4902ZM101.82 24.0602V22.2302C101.86 21.9602 101.67 21.7002 101.4 21.6602C101.35 21.6602 101.3 21.6602 101.26 21.6602H95.62C95.47 21.6802 95.34 21.5802 95.32 21.4302C95.32 21.4102 95.32 21.3802 95.32 21.3602V17.6202C95.3 17.4702 95.4 17.3402 95.55 17.3202C95.57 17.3202 95.6 17.3202 95.62 17.3202H100.26C100.53 17.3602 100.79 17.1702 100.83 16.9002C100.83 16.8502 100.83 16.8002 100.83 16.7602V14.9302C100.87 14.6602 100.68 14.4002 100.41 14.3602C100.36 14.3602 100.31 14.3602 100.27 14.3602H95.63C95.48 14.3802 95.35 14.2802 95.33 14.1302C95.33 14.1102 95.33 14.0802 95.33 14.0602V10.5602C95.31 10.4102 95.41 10.2802 95.56 10.2602C95.58 10.2602 95.61 10.2602 95.63 10.2602H101.27C101.54 10.3002 101.8 10.1102 101.84 9.8402C101.84 9.7902 101.84 9.7402 101.84 9.7002V7.8702C101.88 7.6002 101.69 7.3402 101.42 7.3002C101.37 7.3002 101.32 7.3002 101.28 7.3002H92.48C92.21 7.2602 91.95 7.4502 91.91 7.7202C91.91 7.7702 91.91 7.8202 91.91 7.8602V24.0702C91.87 24.3402 92.06 24.6002 92.33 24.6402C92.38 24.6402 92.43 24.6402 92.47 24.6402H101.27C101.54 24.6802 101.8 24.4902 101.84 24.2202C101.84 24.1702 101.84 24.1202 101.84 24.0802M83.6 24.0802V17.6402C83.58 17.4902 83.68 17.3602 83.83 17.3402C83.85 17.3402 83.88 17.3402 83.9 17.3402H88.54C88.91 17.3402 89.11 17.1402 89.11 16.7402V14.9402C89.15 14.6702 88.96 14.4102 88.69 14.3702C88.64 14.3702 88.59 14.3702 88.55 14.3702H83.91C83.71 14.3702 83.61 14.2702 83.61 14.0402V10.5702C83.59 10.4202 83.69 10.2902 83.84 10.2702C83.86 10.2702 83.89 10.2702 83.91 10.2702H89.35C89.72 10.2702 89.88 10.0702 89.88 9.7002V7.8702C89.88 7.5002 89.71 7.3002 89.35 7.3002H80.75C80.48 7.2602 80.22 7.4502 80.18 7.7202C80.18 7.7702 80.18 7.8202 80.18 7.8602V24.0702C80.14 24.3402 80.33 24.6002 80.6 24.6402C80.65 24.6402 80.7 24.6402 80.74 24.6402H83.04C83.31 24.6802 83.57 24.4902 83.61 24.2202C83.61 24.1702 83.61 24.1202 83.61 24.0802M69.24 10.5702C69.22 10.4202 69.32 10.2902 69.47 10.2702C69.49 10.2702 69.52 10.2702 69.54 10.2702H72.17C72.62 10.2302 73.07 10.3602 73.44 10.6402C73.73 10.9802 73.88 11.4302 73.84 11.8702V13.0702C73.88 13.5002 73.73 13.9202 73.44 14.2402C73.08 14.5102 72.63 14.6402 72.17 14.6102H69.54C69.39 14.6302 69.26 14.5302 69.24 14.3802C69.24 14.3602 69.24 14.3302 69.24 14.3102V10.5702ZM69.24 24.0802V17.6402C69.24 17.4702 69.34 17.3702 69.57 17.3702H71.37L74.07 24.0702C74.13 24.2602 74.24 24.4202 74.4 24.5402C74.63 24.6202 74.86 24.6502 75.1 24.6402H77.3C77.77 24.6402 77.93 24.4402 77.77 24.0102L74.87 17.0702V16.9702C76.47 16.3002 77.27 14.9702 77.27 12.9302V11.7302C77.27 10.3302 76.87 9.2302 76.1 8.4602C75.33 7.6902 74.2 7.2902 72.8 7.2902H66.36C66.09 7.2502 65.83 7.4402 65.79 7.7102C65.79 7.7602 65.79 7.8102 65.79 7.8502V24.0602C65.75 24.3302 65.94 24.5902 66.21 24.6302C66.26 24.6302 66.31 24.6302 66.35 24.6302H68.65C68.92 24.6702 69.18 24.4802 69.22 24.2102C69.22 24.1602 69.22 24.1102 69.22 24.0702M63.22 24.0702V22.2402C63.26 21.9702 63.07 21.7102 62.8 21.6702C62.75 21.6702 62.7 21.6702 62.66 21.6702H57.02C56.87 21.6902 56.74 21.5902 56.72 21.4402C56.72 21.4202 56.72 21.3902 56.72 21.3702V17.6302C56.7 17.4802 56.8 17.3502 56.95 17.3302C56.97 17.3302 57 17.3302 57.02 17.3302H61.66C61.93 17.3702 62.19 17.1802 62.23 16.9102C62.23 16.8602 62.23 16.8102 62.23 16.7702V14.9402C62.27 14.6702 62.08 14.4102 61.81 14.3702C61.76 14.3702 61.71 14.3702 61.67 14.3702H57.03C56.88 14.3902 56.75 14.2902 56.73 14.1402C56.73 14.1202 56.73 14.0902 56.73 14.0702V10.5702C56.71 10.4202 56.81 10.2902 56.96 10.2702C56.98 10.2702 57.01 10.2702 57.03 10.2702H62.67C62.94 10.3102 63.2 10.1202 63.24 9.8502C63.24 9.8002 63.24 9.7502 63.24 9.7102V7.8802C63.28 7.6102 63.09 7.3502 62.82 7.3102C62.77 7.3102 62.72 7.3102 62.68 7.3102H53.88C53.61 7.2702 53.35 7.4602 53.31 7.7302C53.31 7.7802 53.31 7.8302 53.31 7.8702V24.0802C53.27 24.3502 53.46 24.6102 53.73 24.6502C53.78 24.6502 53.83 24.6502 53.87 24.6502H62.67C62.94 24.6902 63.2 24.5002 63.24 24.2302C63.24 24.1802 63.24 24.1302 63.24 24.0902M42.83 10.5802C42.81 10.4302 42.91 10.3002 43.06 10.2802C43.08 10.2802 43.11 10.2802 43.13 10.2802H45.96C46.4 10.2402 46.85 10.3702 47.19 10.6502C47.42 10.8802 47.52 11.2802 47.52 11.8802V12.7802C47.52 13.3502 47.42 13.7502 47.19 13.9802C46.84 14.2602 46.4 14.3902 45.96 14.3502H43.13C42.98 14.3702 42.85 14.2702 42.83 14.1202C42.83 14.1002 42.83 14.0702 42.83 14.0502V10.5802ZM42.83 24.0902V17.6502C42.83 17.4502 42.93 17.3502 43.16 17.3502H46.53C47.96 17.3502 49.03 16.9502 49.8 16.1802C50.57 15.4102 50.97 14.3502 50.97 12.9402V11.7102C50.97 10.3102 50.6 9.2102 49.8 8.4402C49 7.6702 47.97 7.3102 46.53 7.3102H39.96C39.69 7.2702 39.43 7.4602 39.39 7.7302C39.39 7.7802 39.39 7.8302 39.39 7.8702V24.0802C39.35 24.3502 39.54 24.6102 39.81 24.6502C39.86 24.6502 39.91 24.6502 39.95 24.6502H42.25C42.52 24.6902 42.78 24.5002 42.82 24.2302C42.82 24.1802 42.82 24.1302 42.82 24.0902"
        fill="#ffffff"
      />
    </svg>
  );
}
