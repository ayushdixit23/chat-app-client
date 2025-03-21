"use client";
import { SOCKET_URL } from "@/app/utils/constants";
import { useSession } from "next-auth/react";
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error(
            "useSocketContext must be used within a SocketContextProvider"
        );
    }
    return context;
};

interface SocketContextProviderProps {
    children: ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
    children,
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { data } = useSession()

    useEffect(() => {
        if (data?.user.accessToken) {
            const url = SOCKET_URL;
            // const url = "http://localhost:7003"
            const newSocket: Socket | null = io(url, {
                auth: { token: data?.user.accessToken }, // Pass authentication info
                reconnectionAttempts: 100,
                reconnectionDelay: 3000,
                reconnection: true,
                autoConnect: true,
                transports: ["websocket"], // Ensure WebSocket is used
            });
            setSocket(newSocket);
            console.log("Connecting...", newSocket.connected);

            // Cleanup on component unmount or when dependencies change
            return () => {
            newSocket.disconnect()
            };
        }

    }, [data?.user.accessToken]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
