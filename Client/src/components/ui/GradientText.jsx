import React from "react";

export const GradientText = ({
    children,
    className = "",
    colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
    animationSpeed = 8,
    showBorder = false,
}) => {
    const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
        animationDuration: `${animationSpeed}s`,
    };

    return (
        <div
            className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium transition-shadow duration-500 overflow-hidden cursor-pointer ${className}`}
        >
            {showBorder && (
                <div
                    className="absolute inset-0 bg-cover z-0 pointer-events-none animate-gradient"
                    style={{
                        ...gradientStyle,
                        backgroundSize: "300% 100%",
                    }}
                >
                    <div
                        className="absolute inset-0 bg-black rounded-[1.25rem] z-[-1]"
                        style={{
                            width: "calc(100% - 2px)",
                            height: "calc(100% - 2px)",
                            left: "1px",
                            top: "1px",
                        }}
                    ></div>
                </div>
            )}

            <div
                className="inline-block relative z-2 text-transparent bg-clip-text"
                style={{
                    ...gradientStyle,
                    backgroundSize: "300% 100%",
                }}
            >
                {children}
            </div>
        </div>
    );
};

