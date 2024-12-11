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
  types: [
    {
      slot: number;
      type: {
        name: string;
        url: string;
      };
    },
    {
      slot: number;
      type: {
        name: string;
        url: string;
      };
    }
  ];
  sprite: string;
}

function App() {
  const [choices, setChoices] = useState<string[]>([]);
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

    const output: CustomMoveType = {
      name: move.move.name,
      url: move.move.url,
      level: vgd[0].level_learned_at,
      method: vgd[0].move_learn_method.name,
    };

    return output;
  };

  const sortMoves = (a: CustomMoveType, b: CustomMoveType) => {
    if (a.method < b.method) {
      return -1;
    }
    if (a.method > b.method) {
      return 1;
    }
    return 0;
  };

  const handleChoice = async (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLLIElement;
    const pokemon = target.innerText.toLowerCase();

    const response = await PokeAPI.Pokemon.resolve(pokemon);

    const moves = response["moves"]
      .filter(moveInEmerald)
      .map(formatMoveOutput)
      .sort(sortMoves);

    setMoves(moves);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();

    if (input === "") {
      setChoices([]);
    } else {
      setChoices(
        pokemonNames
          .filter((pokemon) => pokemon.name.toLowerCase().includes(input))
          .map(
            (pokemon) =>
              `${pokemon.name[0].toUpperCase()}${pokemon.name.substring(1)}`
          )
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
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
          <p>Is this who you meant?</p>
          <ul>
            {choices.map((choice) => (
              <li key={choice} onClick={handleChoice}>
                {choice}
              </li>
            ))}
          </ul>
        </div>

        <div id="Results">
          <thead>
            <tr>
              <th>Name</th>
              <th>Method</th>
              <th>Level</th>
            </tr>
            {moves.map((move: CustomMoveType) => {
              return (
                <tr key={move.name}>
                  <td>{move.name}</td>
                  <td>{move.method}</td>
                  <td>{move.level}</td>
                </tr>
              );
            })}
          </thead>
        </div>
      </main>
    </div>
  );
}

export default App;
