// Tooltip.jsx
import React, { useState } from 'react';

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    // Container: Relative positioning is key for the absolute tooltip
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <span 
         
          className=" md:block
            absolute z-50 
            px-3 py-1 
            text-xs font-medium text-black 
            bg-black/10 rounded-lg shadow-lg 
           
             left-1/2 -translate-x-1/2 mt-8
            whitespace-nowrap 
          "
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Tooltip;