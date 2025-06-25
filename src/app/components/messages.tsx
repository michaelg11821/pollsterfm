"use client";

import type { Message } from "ably";
import { useChannel } from "ably/react";
import { useState } from "react";

function MessageView({ message }: { message: Message }) {
  const isMine = message.clientId === "my-first-client";
  return (
    <p
      className={`px-2 py-1 shadow-sm ${
        isMine ? "bg-green-100 text-gray-800" : "bg-blue-50 text-gray-800"
      }`}
    >
      {message.data}
    </p>
  );
}

export default function Messages({ poll }: { poll: number }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useChannel(`poll-${poll}`, (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });

  return (
    <div className="item-left mx-auto flex h-[600px] w-full flex-col overflow-hidden rounded-lg font-sans">
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((msg: Message) => (
          <MessageView key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}
