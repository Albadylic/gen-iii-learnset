import { useState } from "react";
import "./App.css";

import pokemonNames from "./pokemon_gen1_to_3_full.json";

import PokeAPI, { IPokemonMove } from "pokeapi-typescript";

interface CustomMoveType {
  name: string;
  url: string;
  level: number | string;
  method: string;
}

interface PokemonJSONType {
  id: number;
  name: string;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  sprite: string;
}

function App() {
  const [choices, setChoices] = useState<PokemonJSONType[]>([]);
  const [moves, setMoves] = useState<CustomMoveType[]>([]);

  const moveInEmerald = (move: IPokemonMove) => {
    return (
      move.version_group_details.filter(
        (move) => move["version_group"]["name"] === "emerald"
      ).length > 0
    );
  };

  const formatMoveOutput = (move: IPokemonMove) => {
    const vgd = move.version_group_details.filter(
      (move) => move["version_group"]["name"] === "emerald"
    );

    // It'd be cool to include the type but this would require a further API call to move.move.url

    const output: CustomMoveType = {
      name: move.move.name,
      url: move.move.url,
      level: vgd[0].level_learned_at,
      method: vgd[0].move_learn_method.name,
    };

    return output;
  };

  const sortMoveLevel = (a: CustomMoveType, b: CustomMoveType) => {
    if (a.level < b.level) {
      return -1;
    }
    if (a.level > b.level) {
      return 1;
    }
    return 0;
  };

  const sortMoveMethod = (a: CustomMoveType, b: CustomMoveType) => {
    if (a.method < b.method) {
      return -1;
    }
    if (a.method > b.method) {
      return 1;
    }
    return 0;
  };

  const handleChoice = async (pokemon: PokemonJSONType) => {
    setChoices([pokemon]);
    const response = await PokeAPI.Pokemon.resolve(pokemon["name"]);

    const moves = response["moves"]
      .filter(moveInEmerald)
      .map(formatMoveOutput)
      .sort(sortMoveLevel)
      .sort(sortMoveMethod);

    setMoves(moves);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();

    if (input === "") {
      setChoices([]);
    } else {
      setChoices(
        pokemonNames.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(input)
        )
      );
    }
  };

  const formatMoveName = (move: string) => {
    move = move.split("-").join(" ");
    return `${move[0].toUpperCase()}${move.substring(1)}`;
  };

  return (
    <div className="App">
      <header className="bg-slate-800 flex justify-center text-2xl text-white p-2">
        <h1>Gen III Moveset Checker</h1>
      </header>
      <main>
        <div id="Search">
          <h3>Type a Pokemon</h3>
          <label htmlFor="pokemon_input">Enter the name of a Pokemon</label>
          <input
            type="text"
            name="pokemon"
            id="pokemon_input"
            onChange={handleChange}
          />
        </div>

        <div id="Confirm">
          <ul className="grid grid-cols-6">
            {choices.map((choice) => (
              <li
                key={choice["name"]}
                onClick={() => handleChoice(choice)}
                className="flex flex-col border m-1 rounded bg-slate-300 text-slate-800	 hover:bg-slate-700	hover:text-slate-300 cursor-pointer	"
              >
                <img src={choice["sprite"]} alt={`${choice["name"]}`} />
                <p>
                  {choice["name"][0].toUpperCase()}
                  {choice["name"].substring(1)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div id="Results">
          <table className="table-auto w-screen">
            <thead>
              <tr className="m-2 bg-slate-700 text-white">
                <th className="text-left">Name</th>
                <th>Method</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((move: CustomMoveType) => {
                return (
                  <tr key={move.name} className="odd:bg-white even:bg-slate-50">
                    <td>{formatMoveName(move.name)}</td>
                    <td className="text-center">
                      {formatMoveName(move.method)}
                    </td>
                    <td className="text-center">{move.level}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;
