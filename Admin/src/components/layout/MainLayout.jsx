import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-[#F8FAFC] text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 font-['Outfit'] bg-[#F8FAFC]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
