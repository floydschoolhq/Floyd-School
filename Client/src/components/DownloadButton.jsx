import React from 'react'
import Tooltip from './Tooltip';
import { DownloadCloudIcon } from 'lucide-react';
import Brochure from '../assets/pdf/Brochure.pdf';

const DownloadButton = () => {
    const customOrange = '#FF8C00';
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDownload = () => {
        // Open in new tab (preview)
        window.open(Brochure, '_blank');

        // Trigger download
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = Brochure;
            link.download = 'Brochure.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 100);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 transition-opacity duration-300">
            <Tooltip text="Download catalog">
                <button
                    onClick={handleDownload}
                    className="p-4 flex items-center gap-2 rounded-full text-white transition duration-150 shadow-xl hover:shadow-2xl hover:scale-105 transform cursor-pointer"
                    style={{ backgroundColor: customOrange }}
                    aria-label="Download Brochure"
                >
                    <DownloadCloudIcon className="w-6 h-6" />
                    <span className="font-semibold md:block hidden">Download Brochure</span>
                </button>
            </Tooltip>
        </div>
    )
}

export default DownloadButton
