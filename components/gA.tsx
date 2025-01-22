// components/GoogleAnalytics.js

import Script from "next/script";
import React from "react";

export default function GoogleAnalytics() {
  return (
    <>
      {/* Load the gtag script asynchronously */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DS36M6GLE9"
        strategy="afterInteractive"
      />
      {/* Initialize the gtag */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DS36M6GLE9');
        `}
      </Script>
    </>
  );
}
