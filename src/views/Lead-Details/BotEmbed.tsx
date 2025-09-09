"use client";
import { useEffect } from "react";

const BotEmbed = () => {
  useEffect(() => {
    // Set up the global __ow object
    (window as any).__ow = (window as any).__ow || {};
    (window as any).__ow.organizationId =
      "917b8286-19d3-4888-97a9-d53a266e1f66";
    (window as any).__ow.template_id = "661b54de-f014-462d-a9a9-7db1a1d13a63";
    (window as any).__ow.integration_name = "manual_settings";
    (window as any).__ow.product_name = "chatbot";

    // Load the script
    const script = document.createElement("script");
    script.src = "https://cdn.openwidget.com/openwidget.js";
    script.async = true;
    script.type = "text/javascript";
    document.head.appendChild(script);

    return () => {
      // cleanup if component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return null;
};

export default BotEmbed;
