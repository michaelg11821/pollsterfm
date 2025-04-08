/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
} from "lucide-react";

import { spotifyApiWithCredentials } from "@/lib/actions";

import Link from "next/link";
import Image from "next/image";

import styles from "./ListeningHistory.module.css";

type HistoryProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string }>;
};

async function History({ params, searchParams }: HistoryProps) {
  return (
    <p>
      just display the 50 tracks on one page. try fetching 25 tracks twice in
      parallel
    </p>
  );
}

export default History;
