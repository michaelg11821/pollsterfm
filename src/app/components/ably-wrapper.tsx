"use client";

import { getAblyToken } from "@/lib/actions";
import { ErrorInfo, Realtime, type TokenRequest } from "ably";
import { AblyProvider } from "ably/react";
import { useEffect, useRef, useState } from "react";

export default function AblyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client, setClient] = useState<Realtime | null>(null);
  const clientRef = useRef<Realtime | null>(null);

  useEffect(() => {
    const createClient = async () => {
      const realtimeClient = new Realtime({
        key: process.env.ABLY_API_KEY!,
        authCallback: async (tokenParams, callback) => {
          let tokenRequest: TokenRequest | undefined;

          try {
            tokenRequest = await getAblyToken();
          } catch (err) {
            return callback(err as ErrorInfo | string | null, null);
          }

          callback(null, tokenRequest);
        },
      });

      clientRef.current = realtimeClient;
      setClient(realtimeClient);
    };

    createClient();

    return () => {
      if (clientRef.current) {
        clientRef.current.connection.close();
        clientRef.current = null;
      }
    };
  }, []);

  if (!client) return null;

  return <AblyProvider client={client}>{children}</AblyProvider>;
}
