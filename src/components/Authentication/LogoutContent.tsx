"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LogoutContent: React.FC = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    // Auto logout when component mounts
    const performLogout = async () => {
      setIsLoggingOut(true);
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (res.ok) {
          setIsLoggedOut(true);
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, []);

  const handleSignInRedirect = () => {
    router.push("/auth/sign-in");
  };

  return (
    <>
      <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
        <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
            <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
              <Image
                src="/images/logout.jpg"
                alt="logout-image"
                className="rounded-[25px]"
                width={646}
                height={804}
              />
            </div>

            <div className="xl:ltr:pl-[90px] xl:rtl:pr-[90px] 2xl:ltr:pl-[120px] 2xl:rtl:pr-[120px] order-1 lg:order-2">
              <Image
                src="/images/logo-big.svg"
                alt="logo"
                className="inline-block dark:hidden"
                width={142}
                height={38}
              />
              <Image
                src="/images/white-logo-big.svg"
                alt="logo"
                className="hidden dark:inline-block"
                width={142}
                height={38}
              />

              <div className="my-[17px] md:my-[25px]">
                <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[10px]">
                  {isLoggingOut ? "Logging out..." : "Goodbye!"}
                </h1>
                <p className="font-medium leading-[1.5] lg:text-md text-[#445164] dark:text-gray-400">
                  {isLoggingOut ? "Please wait..." : isLoggedOut ? "You have been logged out successfully" : "You Are Logged out"}
                </p>
              </div>

              {isLoggedOut && (
                <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Logout berhasil! Anda akan diarahkan ke halaman login.
                  </p>
                </div>
              )}

              <div className="flex items-center mb-[20px]">
                <Image
                  src="/images/admin.png"
                  alt="admin-image"
                  className="rounded-full w-[50px] border-[2px] ltr:mr-[13px] rtl:ml-[13px] border-primary-200"
                  width={50}
                  height={50}
                />
                <span className="font-semibold text-black dark:text-white block">
                  Thank you for using Trezo!
                </span>
              </div>

              <button
                onClick={handleSignInRedirect}
                disabled={isLoggingOut}
                className="md:text-md block w-full text-center transition-all rounded-md font-medium py-[12px] px-[25px] text-white bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-[5px]">
                  <i className="material-symbols-outlined">login</i>
                  {isLoggingOut ? "Logging out..." : "Sign In Again"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutContent;
