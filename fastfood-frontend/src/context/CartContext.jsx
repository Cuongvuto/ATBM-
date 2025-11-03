// src/context/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Hàm helper để đọc giỏ hàng từ localStorage
const getInitialCart = () => {
    try {
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];
    } catch (error) {
        console.error("Không thể đọc giỏ hàng từ localStorage", error);
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(getInitialCart);

    const addToCart = (product, quantity) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find((item) => item.id === product.id);
            let newItems;
            if (itemExists) {
                newItems = prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                newItems = [...prevItems, { ...product, quantity }];
            }
            // Ghi đè vào localStorage
            localStorage.setItem('cart', JSON.stringify(newItems));
            return newItems;
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter((item) => item.id !== productId);
            // Ghi đè vào localStorage
            localStorage.setItem('cart', JSON.stringify(newItems));
            return newItems;
        });
    };

    const clearCart = () => {
        // Xóa cả state và localStorage
        localStorage.removeItem('cart');
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};