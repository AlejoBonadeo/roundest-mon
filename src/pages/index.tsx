import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { FC, useState } from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home: NextPage = () => {
  const [ids, updateIds] = useState<[number, number]>(() =>
    getOptionsForVote()
  );
  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

  const fireVote = trpc.useMutation(["cast-vote"]);

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      fireVote.mutate({ votedFor: first, votedAgainst: second });
    } else {
      fireVote.mutate({ votedFor: second, votedAgainst: first });
    }
    updateIds(getOptionsForVote());
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-between">
      <Head>
        <title>Roundest mon</title>
      </Head>
      <div className="pt-8 text-center text-2xl">Which Pokemon is rounder?</div>
      {!firstPokemon.isLoading &&
      firstPokemon.data &&
      !secondPokemon.isLoading &&
      secondPokemon.data ? (
        <div className="flex max-w-2xl items-center justify-between rounded border p-8">
          <PokemonListing
            pokemon={firstPokemon.data}
            vote={() => voteForRoundest(first)}
          />
          <div className="p-8">Vs</div>
          <PokemonListing
            pokemon={secondPokemon.data}
            vote={() => voteForRoundest(second)}
          />
          <div className="p-2" />
        </div>
      ) : (
        <img src="/rings.svg" className="w-48" />
      )}
      <div className="w-full pb-2 text-center text-xl">
        <Link href="/results" passHref>
          <a>Results</a>
        </Link>
        {" "}|{" "}
        <a href="https://www.github.com/AlejoBonadeo/roundest-mon">GitHub</a>
      </div>
    </div>
  );
};

const PokemonListing: FC<{
  pokemon: inferQueryResponse<"get-pokemon-by-id">;
  vote: () => void;
}> = ({ pokemon, vote }) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={pokemon.spriteUrl || ""}
        width={256}
        height={256}
        layout="fixed"
      />
      <div className="mt-[-2rem] text-center text-xl capitalize">
        {pokemon.name}
      </div>
      <button onClick={vote} className={btn}>
        Rounder
      </button>
    </div>
  );
};

export default Home;
