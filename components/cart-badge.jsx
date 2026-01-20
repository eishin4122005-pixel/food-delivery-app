"use client"; 
 
import { useEffect, useState } from "react"; 
 
export function CartBadge({ isLoggedIn }) { 
  const [count, setCount] = useState(0); 
 
  const updateCount = () => { 
    if (!isLoggedIn) { 
      setCount(0); 
      return; 
    } 
    const cart = JSON.parse(localStorage.getItem("cart") || "[]"); 
    setCount(cart.length); 
  }; 
 
  useEffect(() => { 
    updateCount(); 
 
    // Listen for localStorage updates 
    const handleStorageChange = () => updateCount(); 
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange); 
}, [isLoggedIn]); 
return ( 
<div className="relative"> 
{count > 0 && ( 
<span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full 
bg-red-500 text-xs text-white"> 
{count} 
</span> 
)} 
</div> 
);
}