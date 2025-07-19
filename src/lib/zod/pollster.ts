import z from "zod";
import { affinities } from "../constants/affinities";
import { pollTypes } from "../constants/polls";

export const Affinity = z.literal(affinities, { error: "Invalid affinity." });

export const PollType = z.literal(pollTypes, { error: "Invalid poll type." });
