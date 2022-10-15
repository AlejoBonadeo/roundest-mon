import "tailwindcss/tailwind.css";
import "../styles/global.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../backend/router";

function MyApp({ Component, pageProps}: AppProps) {
  return <Component {...pageProps}/>
}

function getBaseUrl() {
  if(process.browser) return "/api/trpc";
  if(process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/trpc`;
  return `http://localhost:${process.env.PORT ?? 3000}/api/trpc`
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = getBaseUrl();
    return { url }  
  },
  ssr: false
})(MyApp);
