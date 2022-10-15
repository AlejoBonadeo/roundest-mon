import { PokemonClient } from "pokenode-ts";
import { prisma } from "../src/backend/utils/prisma";

const doBackfill = async () => {

  await prisma.pokemon.deleteMany();

  const pokeApi = new PokemonClient();

  const allPokemon = await pokeApi.listPokemons(0, 493);

  await prisma.pokemon.createMany({
    data: allPokemon.results.map(({ name }, i) => ({
      name,
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        i + 1
      }.png`,
      id: i + 1,
    })),
  });
};
doBackfill();
