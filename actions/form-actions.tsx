"use server"
import { FormValues } from "@/app/(auth)/_components/login-form"

export const handleCredentialLogin = async (data: FormValues) => {
    try {
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}