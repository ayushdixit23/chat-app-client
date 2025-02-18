"use server";

import { FormValues } from "@/app/(auth)/_components/login-form";
import {
    DEFAULT_REDIRECT_PATH,
    DEFAULT_RESTRICTED_REDIRECT_PATH,
} from "@/app/utils/constants";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export const handleCredentialLogin = async (data: FormValues) => {
    try {
        const result = await signIn("credentials", {
            ...data,
            redirect: false,
        });

        return result;
    } catch (error: unknown) {
        console.error(error);

        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: error.message || "Invalid credentials." };
                default:
                    return { error: "Something went wrong." };
            }
        }

        throw error;
    }
};

export const signGoogleServer = async () => {
    try {
        const result = await signIn("google", {
            callbackUrl: DEFAULT_REDIRECT_PATH,
        });
        return result;
    } catch (error) {
        throw error;
    }
};

export const logOut = async () => {
    await signOut({
        redirect: true,
        redirectTo: DEFAULT_RESTRICTED_REDIRECT_PATH,
    });
};
