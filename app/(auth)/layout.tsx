"use client"
import React from 'react';
import { Card } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";

const FloatingEmoji = ({ emoji, position, gradient }: { emoji: string; position: string; gradient: string }) => {
    return (
        <div
            className={`absolute animate-float opacity-70 text-transparent bg-clip-text ${gradient} ${position}`}
            style={{
                animation: `float 3s ease-in-out infinite`,
                fontSize: '28px'
            }}
        >
            {emoji}
        </div>
    );
};


export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="h-dvh sm:min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700 p-3 sm:p-4 flex items-center justify-center relative overflow-hidden">
            {/* Fun Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl" />
            </div>

            {/* Floating Elements with Gradient Text */}
            <div className="absolute inset-0">
                <FloatingEmoji emoji="💭" position="left-[200px] top-1/4" gradient="bg-gradient-to-r from-blue-400 to-purple-500" />
                <FloatingEmoji emoji="✨" position="left-[200px] bottom-1/4" gradient="bg-gradient-to-r from-yellow-400 to-orange-500" />
                <FloatingEmoji emoji="💫" position="right-[200px] top-1/4" gradient="bg-gradient-to-r from-pink-400 to-red-500" />
                <FloatingEmoji emoji="🌟" position="right-[200px] bottom-1/4" gradient="bg-gradient-to-r from-green-400 to-teal-500" />
            </div>


            <Card className="w-full max-w-md relative backdrop-blur-md bg-white/80 dark:bg-[#0d0d0d] border-none shadow-xl rounded-3xl overflow-hidden">
                <div className="p-4 py-7 sm:p-7">
                    {/* Fun Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-4 relative transform rotate-45">
                            <MessageCircle className="w-6 h-6 sm:w-10 sm:h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                            Let's Chat! 👋
                        </h1>
                    </div>

                    {children}
                </div>
            </Card>
        </div>
    );
}

