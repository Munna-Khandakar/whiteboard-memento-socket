import {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';

const useSocket = (url, options = {}) => {
    const socketRef = useRef(null); // useRef for persistent socket instance

    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeSocket = () => {
            try {
                socketRef.current = io(url, options);

                socketRef.current.on('connect', () => {
                    setIsConnected(true);
                    setError(null);
                });

                socketRef.current.on('connect_error', (err) => {
                    setIsConnected(false);
                    setError(err);
                });

                socketRef.current.on('disconnect', () => {
                    setIsConnected(false);
                });

                // Cleanup function to disconnect on unmount
                return () => {
                    if (socketRef.current) {
                        socketRef.current.disconnect();
                        socketRef.current = null; // Clear reference
                    }
                };
            } catch (err) {
                setIsConnected(false);
                setError(err);
            }
        };

        initializeSocket();

        // Dependency array: Only run if url or options change
    }, [url, options]);

    const emit = (event, ...args) => {
        if (socketRef.current) {
            socketRef.current.emit(event, ...args);
        } else {
            console.error('Socket not connected, cannot emit event:', event);
        }
    };

    const on = (event, callback) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        } else {
            console.error('Socket not connected, cannot listen to event:', event);
        }

        // Consider returning an unsubscribe function for better memory management
        // (optional implementation):
        // return () => socketRef.current.off(event, callback);
    };

    return {isConnected, error, emit, on};
};

export default useSocket;
