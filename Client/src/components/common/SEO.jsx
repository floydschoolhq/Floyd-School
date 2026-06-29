import React, { useEffect } from 'react';

/**
 * SEO component to handle meta tags and page titles
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.canonical - Canonical URL
 */
const SEO = ({ title, description, canonical }) => {
    useEffect(() => {
        // Update Title
        let fullTitle = '';
        if (title) {
            if (title.toUpperCase().includes('FLOYD SCHOOL')) {
                fullTitle = title;
            } else {
                fullTitle = `${title} | FLOYD SCHOOL`;
            }
        } else {
            fullTitle = 'FLOYD SCHOOL';
        }
        document.title = fullTitle;

        // Update Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || 'Master tech with live projects, 1-on-1 mentorship, and real-world skills at FLOYD SCHOOL.');
        }

        // Handle Canonical Link
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        
        const currentUrl = canonical || window.location.origin + window.location.pathname;
        link.setAttribute('href', currentUrl);

        // Update Open Graph tags if they exist
        const updateOgTag = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        updateOgTag('og:title', fullTitle);
        updateOgTag('og:description', description || 'Master tech with live projects, 1-on-1 mentorship, and real-world skills');
        updateOgTag('og:url', currentUrl);
        updateOgTag('og:type', 'website');
        updateOgTag('og:image', window.location.origin + '/logo.png');

    }, [title, description, canonical]);

    return null; // This component doesn't render anything
};

export default SEO;
