import { useState } from "react";
import "./App.css";

import pokemonNames from "./pokemon_gen1_to_3_full.json";

function App() {
  const [choices, setChoices] = useState(["pikachu"]);
  const [pokemon, setPokemon] = useState("pikachu");
  const [moves, setMoves] = useState([]);

  const moveInEmerald = (move: any) => {
    return (
      move.version_group_details.filter(
        (move: any) => move["version_group"]["name"] === "emerald"
      ).length > 0
    );
  };

  const formatMoveOutput = (move: any) => {
    const vgd = move.version_group_details.filter(
      (move: any) => move["version_group"]["name"] === "emerald"
    );
    move.version_group_details = vgd[0];

    const output = {
      name: move.move.name,
      url: move.move.url,
      level: vgd[0].level_learned_at,
      method: vgd[0].move_learn_method.name,
    };

    return output;
  };

  const sortMoves = (a: any, b: any) => {
    if (a.method < b.method) {
      return -1;
    }
    if (a.method > b.method) {
      return 1;
    }
    return 0;
  };

  const handleSubmit = async () => {
    const formatPokemon = (str: string) => {
      return str.toLowerCase();
    };
    const url = `https://pokeapi.co/api/v2/pokemon/${formatPokemon(pokemon)}/`;

    const response = await fetch(url);

    const json = await response.json();

    const moves = json["moves"]
      .filter(moveInEmerald)
      .map(formatMoveOutput)
      .sort(sortMoves);

    setMoves(moves);
  };

  const handleChange = (e: any) => {
    const input = e.target.value;
    setChoices(
      pokemonNames.pokemon
        .filter((pokemon) => pokemon.name.toLowerCase().includes(input))
        .map((pokemon: any) => pokemon.name)
    );
  };

  const handleChoice = (e: any) => {
    setPokemon(e.target.innerText.toLowerCase());
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
          <button onClick={handleSubmit}>Go!</button>
        </div>

        <div id="Results">
          <thead>
            <tr>
              <th>Name</th>
              <th>Method</th>
              <th>Level</th>
            </tr>
            {moves.map((move: any) => {
              return (
                <tr>
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
