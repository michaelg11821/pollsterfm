"use client";

import { useAbly, useConnectionStateListener } from "ably/react";
import { useState } from "react";

export function ConnectionState() {
  const ably = useAbly();
  const [connectionState, setConnectionState] = useState(ably.connection.state);

  useConnectionStateListener((stateChange) => {
    setConnectionState(stateChange.current);
  });

  return (
    <div className="mt-4 h-full text-center">
      <p>connection: {connectionState}!</p>
    </div>
  );
}
