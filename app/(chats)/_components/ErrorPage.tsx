import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const ErrorPage = ({ message }: { message?: string }) => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 text-center">
                <AlertTriangle className="text-red-500 w-12 h-12 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{message ? message : "Oops! Something went wrong."}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    We couldn't load the page you requested.
                </p>
                <div className="mt-4 flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
                    <Button onClick={() => router.push("/")}>Home</Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
