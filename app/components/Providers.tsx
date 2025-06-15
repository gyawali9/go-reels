import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <SessionProvider refetchInterval={5 * 60}>
        <ImageKitProvider urlEndpoint={urlEndpoint}>
          {children}
        </ImageKitProvider>
      </SessionProvider>
    </>
  );
}
