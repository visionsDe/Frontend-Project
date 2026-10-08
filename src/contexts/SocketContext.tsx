import React, { createContext, useContext, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { environment } from '@/environments/environment';
import { appendMessage } from '@/redux-store/slices/chatModule';
import { useDispatch } from "react-redux";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = io(environment.socketUrl, {
            transports: ['websocket'],
            query: {
                token: process.env.NEXT_PUBLIC_WEBSOCKET_TOKEN
            }
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join', { user_id: localStorage.getItem('adminId') });
        });

        socket.on('new_message', (message: any) => {
            if(parseInt(localStorage.getItem('conversationId') || '0') === message?.conversation_id) {
                dispatch(appendMessage(message));
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
};
