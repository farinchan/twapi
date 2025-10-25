"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validation";
import { useRouter } from "next/navigation";

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RegisterInput>({ resolver: zodResolver(registerSchema), mode: "onTouched" });

  const onSubmit = async (values: RegisterInput) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Registrasi berhasil! Mengarahkan ke halaman login...");
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 2000);
        return;
      }

      if (res.status === 422) {
        setServerError(data?.message ?? "Validasi gagal");
      } else {
        setServerError(data?.message ?? "Registrasi gagal");
      }
    } catch (error) {
      setServerError("Terjadi kesalahan pada jaringan");
    }
  };

  return (
    <>
      <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[120px] xl:py-[135px]">
        <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
            <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
              <Image
                src="/images/sign-up.jpg"
                alt="sign-up-image"
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
                <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                  Sign Up to Trezo Dashboard
                </h1>
                <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                  Sign Up with social account or enter your details
                </p>
              </div>

              {serverError && (
                <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                  <p className="text-sm text-red-700 dark:text-red-400">{serverError}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                  <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
                </div>
              )}

              <div className="flex items-center justify-between mb-[20px] md:mb-[23px] gap-[12px]">
                <div className="grow">
                  <button
                    type="button"
                    className="block text-center w-full rounded-md transition-all py-[8px] md:py-[10.5px] px-[15px] md:px-[25px] text-black dark:text-white border border-[#D6DAE1] bg-white dark:bg-[#0a0e19] dark:border-[#172036] shadow-sm hover:border-primary-500"
                  >
                    <Image
                      src="/images/icons/google.svg"
                      className="inline-block"
                      alt="google"
                      width={25}
                      height={25}
                    />
                  </button>
                </div>

                <div className="grow">
                  <button
                    type="button"
                    className="block text-center w-full rounded-md transition-all py-[8px] md:py-[10.5px] px-[15px] md:px-[25px] text-black dark:text-white border border-[#D6DAE1] bg-white dark:bg-[#0a0e19] dark:border-[#172036] shadow-sm hover:border-primary-500"
                  >
                    <Image
                      src="/images/icons/facebook2.svg"
                      className="inline-block"
                      alt="google"
                      width={25}
                      height={25}
                    />
                  </button>
                </div>

                <div className="grow">
                  <button
                    type="button"
                    className="block text-center w-full rounded-md transition-all py-[8px] md:py-[10.5px] px-[15px] md:px-[25px] text-black dark:text-white border border-[#D6DAE1] bg-white dark:bg-[#0a0e19] dark:border-[#172036] shadow-sm hover:border-primary-500"
                  >
                    <Image
                      src="/images/icons/apple.svg"
                      className="inline-block"
                      alt="google"
                      width={25}
                      height={25}
                    />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-[15px] relative">
                  <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="mb-[15px] relative">
                  <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    inputMode="email"
                    autoComplete="email"
                    type="email"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="example@trezo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mb-[15px] relative" id="passwordHideShow">
                  <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                    Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    id="password"
                    placeholder="Type password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="md:text-md block w-full text-center transition-all rounded-md font-medium my-[20px] md:my-[25px] py-[12px] px-[25px] text-white bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-[5px]">
                    <i className="material-symbols-outlined">person_4</i>
                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                  </span>
                </button>
              </form>

              <p className="!leading-[1.6]">
                By confirming your email, you agree to our{" "}
                <Link
                  href="#"
                  className="font-medium text-black dark:text-white transition-all hover:text-primary-500"
                >
                  Terms of Service
                </Link>{" "}
                and that you have read and understood our{" "}
                <Link
                  href="#"
                  className="font-medium text-black dark:text-white transition-all hover:text-primary-500"
                >
                  Privacy Policy
                </Link>
              </p>

              <p className="!leading-[1.6]">
                Already have an account.{" "}
                <Link
                  href="/auth/sign-in"
                  className="text-primary-500 transition-all font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
