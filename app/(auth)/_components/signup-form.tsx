"use client";
import { useForm } from "react-hook-form";
import { API, DEFAULT_REDIRECT_PATH } from "@/app/utils/constants";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdLinkedCamera } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler } from "@/app/utils/helper";
import { useRouter } from "next/navigation";
import { handleCredentialLogin } from "@/actions/auth";

const formSchema = z.object({
    image: z
        .any()
        .refine((file) => file?.type.startsWith("image/"), {
            message: "Please upload a valid image.",
        })
        .refine((file) => file?.size <= 5 * 1024 * 1024, {
            message: "Image size should be less than 5MB.",
        })
        .refine((file) => Boolean(file), {
            message: "Image is required.",
        }),
    fullname: z
        .string()
        .min(3, { message: "Fullname must be at least 3 characters" }),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" }),
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, {
            message: "Invalid email address format",
        }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            fullname: "",
            image: null,
            email: "",
            password: "",
        },
    });

    async function createAccount(data: FormValues) {
        setLoading(true);
        const formData = new FormData();
        formData.append("fullName", data.fullname);
        formData.append("userName", data.username);
        formData.append("email", data.email);
        formData.append("password", data.password);

        if (data.image instanceof File) {
            formData.append("profilePic", data.image);
        }

        try {
            const response = await axios.post(`${API}/auth/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {

                toast.success("Account Created Successfully!")


                await handleCredentialLogin({
                    email: data.email,
                    password: data.password,
                });

                router.push(DEFAULT_REDIRECT_PATH)
            } else {
                toast.error(response.data.message || "Something Went Wrong!")
            }
        } catch (err) {
            errorHandler(err)
        } finally {
            setLoading(false);
        }

    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file);
            form.clearErrors("image");
        }
    };

    return (
        <>

            <Form {...form} >
                <form
                    onSubmit={form.handleSubmit(createAccount)}
                    className="flex flex-col gap-4"
                >
                    {/* Image upload field */}

                    <div className=" max-h-[300px] overflow-y-scroll p-1 flex flex-col gap-4">
                        <div className="flex flex-col items-center">
                            <div
                                className="w-20 h-20 rounded-full border flex items-center justify-center"
                                onClick={() => document.getElementById("imageInput")?.click()} // Trigger file input on div click
                            >
                                {form.watch("image") ? (
                                    <img
                                        src={URL.createObjectURL(form.watch("image"))}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <MdLinkedCamera className="text-xl text-gray-500" />
                                )}
                            </div>
                            <input
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>

                        {form.formState.errors.image && (
                            <p className="text-red-500 text-center text-xs">
                                {form.formState.errors.image?.message?.toString()}
                            </p>
                        )}

                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fullname</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            {...field}
                                            className="mt-1 bg-white/50 dark:bg-transparent border border-blue-100 outline-none rounded-xl h-12 pl-4"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="johndoe"
                                            {...field}
                                            className="mt-1 bg-white/50 dark:bg-transparent border border-blue-100 outline-none rounded-xl h-12 pl-4"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john@example.com"
                                            {...field}
                                            className="mt-1 bg-white/50 dark:bg-transparent border border-blue-100 outline-none rounded-xl h-12 pl-4"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="*******"
                                            {...field}
                                            className="mt-1 bg-white/50 dark:bg-transparent border border-blue-100 outline-none rounded-xl h-12 pl-4"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="p-1">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            className="w-full gradient-bg gradient-bg:hover text-white py-3 rounded-xl font-semibold shadow-md"
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? "Creating..." : "Create Account"}
                        </motion.button>
                    </div>
                </form>
            </Form>



            <p className="text-sm font-light mt-6 dark:text-white text-center">
                Already have an account ?{" "}
                <Link
                    href="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                    Log in
                </Link>
            </p>


        </>
    );
}