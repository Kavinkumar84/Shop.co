import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = 'ShopCo - Premium Electronics & Gadgets';
    const siteDescription = 'ShopCo offers the best deals on premium electronics, smart gadgets, mobile phones, and home appliances. Experience cinema-style entertainment and smart living.';
    const siteUrl = 'https://shopco.site';
    const siteImage = `${siteUrl}/assets/banner1.png`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | ShopCo` : siteTitle}</title>
            <meta name="description" content={description || siteDescription} />
            <meta name="keywords" content={keywords || 'electronics, gadgets, mobile phones, smart devices, shopco, online shopping'} />
            {url && <link rel="canonical" href={url} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || siteUrl} />
            <meta property="og:title" content={title ? `${title} | ShopCo` : siteTitle} />
            <meta property="og:description" content={description || siteDescription} />
            <meta property="og:image" content={image || siteImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url || siteUrl} />
            <meta property="twitter:title" content={title ? `${title} | ShopCo` : siteTitle} />
            <meta property="twitter:description" content={description || siteDescription} />
            <meta property="twitter:image" content={image || siteImage} />
        </Helmet>
    );
};

export default SEO;
