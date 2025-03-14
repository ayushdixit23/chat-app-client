"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "@/app/utils/constants";
import { errorHandler } from "@/app/utils/helper";

// Import components
import ThemeToggleButton from "./_components/ThemeToggleButton";
import ProfileImageSection from "./_components/ProfileImageSection";
import ProfileForm from "./_components/ProfileForm";
import ProfileInfoSection from "./_components/ProfileInfoSection";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define form schema with zod
const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Username can only contain letters, numbers and underscores",
        }),
    about: z
        .string()
        .min(10, { message: "About must be at least 10 characters" }),
});

const Page: React.FC = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { data, update } = useSession();
    const [imagePreview, setImagePreview] = useState<File | string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { setTheme, theme } = useTheme()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data?.user?.fullName,
            email: data?.user?.email,
            username: data?.user?.userName,
            about: data?.user?.about,
        },
    });

    const startEditing = () => {
        form.reset({
            name: data?.user.fullName,
            email: data?.user.email,
            username: data?.user.userName,
            about: data?.user.about,
        });
        setImagePreview(data?.user.profilePic as string);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setImagePreview(data?.user.profilePic as string);
        form.reset();
    };

    const toggleDarkMode = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImagePreview(e.target.files[0]);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSaving(true);

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("username", values.username);
            formData.append("about", values.about);
            formData.append("email", values.email);
            if (imagePreview instanceof File) {
                formData.append("profilePic", imagePreview);
            }

            const res = await axios.post(`${API}/auth/settings`, formData, {
                headers: {
                    Authorization: `Bearer ${data?.user.accessToken}`,
                },
            });

            if (res.data.success) {
                setTimeout(async () => {
                    await update({
                        user: {
                            ...data?.user,
                            fullName: values.name,
                            userName: values.username,
                            email: values.email,
                            about: values.about,
                            ...(res.data.profilePic && { profilePic: res.data.profilePic })
                        },
                    });
                }, 3000)

                toast.success(res.data.message);
            } else {
                toast.error("Something Went Wrong!");
            }
            setIsEditing(false);
        } catch (error) {
            errorHandler(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-full mx-auto p-4"
        >
            <Card className="dark:bg-[#0d0d0d] dark:text-white dark:border-gray-800">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">User Settings</CardTitle>
                        <ThemeToggleButton onToggle={toggleDarkMode} />
                    </div>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isEditing ? "edit" : "view"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ProfileImageSection
                                profilePic={data?.user.profilePic || ""}
                                imagePreview={imagePreview}
                                isEditing={isEditing}
                                onImageChange={handleImageChange}
                                userName={data?.user?.fullName || ""}
                            />
                            {isEditing ? (
                                <ProfileForm
                                    formSchema={formSchema}
                                    onSubmit={onSubmit}
                                    defaultValues={form.getValues()}
                                    isSaving={isSaving}
                                    cancelEditing={cancelEditing}
                                />
                            ) : (
                                <ProfileInfoSection
                                    user={data?.user}
                                    startEditing={startEditing}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Page;
