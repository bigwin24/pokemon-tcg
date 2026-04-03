export const BASE_URL = "https://api.pokemontcg.io/v2";

export const headers = {
  "X-Api-Key": process.env.POKEMON_TCG_API_KEY ?? "",
};
