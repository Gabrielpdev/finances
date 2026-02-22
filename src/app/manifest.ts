import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finanças",
    short_name: "Finanças",
    description: "Controle e visualização das suas finanças",
    start_url: "/",
    display: "standalone",
    background_color: "#e5e5e5",
    theme_color: "#e5e5e5",
    lang: "pt-BR",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
