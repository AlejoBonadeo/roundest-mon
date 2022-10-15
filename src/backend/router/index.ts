import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { PokemonClient } from "pokenode-ts";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-pokemon-by-id", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      const pokemon = await prisma.pokemon.findUnique({
        where: { id: input.id },
      });

      if (!pokemon) throw new TRPCError({ code: "NOT_FOUND" });

      return { name: pokemon.name, spriteUrl: pokemon.spriteUrl };
    },
  })
  .mutation("cast-vote", {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      const voteInDB = await prisma.vote.create({
        data: {
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        },
      });
      return { success: true, vote: voteInDB };
    },
  });

export type AppRouter = typeof appRouter;
