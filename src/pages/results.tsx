import { NextPage, GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { FC } from "react";
import { prisma } from "../backend/utils/prisma";
import { AsyncReturnType } from "../utils/inferAsyncReturnType";

const getPokemonInOrder = async () => {
  return prisma.pokemon.findMany({
    orderBy: { VotesFor: { _count: "desc" } },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: { select: { VotesFor: true, VotesAgainst: true } },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = ({
  VotesFor,
  VotesAgainst,
}: PokemonQueryResult[number]["_count"]) => {
  if(VotesFor + VotesAgainst === 0) return 0;
  return VotesFor / (VotesFor + VotesAgainst) * 100;
};

const PokemonListing: FC<{ pokemon: PokemonQueryResult[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex items-center border-b p-2 justify-between">
      <div className="flex items-center">
        <Image src={pokemon.spriteUrl} width={64} height={64} />
        <div className="capitalize">{pokemon.name}</div>
      </div>
      <div>{`${generateCountPercent(pokemon._count)}%`}</div>
    </div>
  );
};

const ResultsPage: NextPage<{
  pokemon: PokemonQueryResult;
}> = ({ pokemon }) => {
  return (
    <div className="flex flex-col items-center">
        <Head>
        <title>Roundest mon</title>
      </Head>
      <div className="p-4" />
      <h2 className="text-2xl">Results</h2>
      <div className="p-4" />
      <div className="flex w-full max-w-2xl flex-col border">
        {pokemon.map((currentPokemon) => (
          <PokemonListing pokemon={currentPokemon} key={currentPokemon.id} />
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const pokemonOrdered = await getPokemonInOrder();
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};

export default ResultsPage;
