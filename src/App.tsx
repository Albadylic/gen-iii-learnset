import { useState } from "react";
import "./App.css";

import pokemonNames from "./pokemon_gen1_to_3_full.json";

function App() {
  const [input, setInput] = useState("pikachu");
  const [choices, setChoices] = useState(["pikachu"]);
  const [pokemon, setPokemon] = useState("pikachu");
  const [moves, setMoves] = useState([]);

  const isMoveGenIII = (move: any) => {
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
    return move;
  };

  const handleSubmit = async () => {
    const formatPokemon = (str: string) => {
      return str.toLowerCase();
    };
    const url = `https://pokeapi.co/api/v2/pokemon/${formatPokemon(pokemon)}/`;

    const response = await fetch(url);

    const json = await response.json();

    const moves = json["moves"].filter(isMoveGenIII).map(formatMoveOutput);

    setMoves(moves);
  };

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleSearch = (e: any) => {
    setChoices(
      pokemonNames.pokemon
        .filter((pokemon) => pokemon.name.includes(input))
        .map((pokemon: any) => pokemon.name)
    );
  };

  const handleChoice = (e: any) => {
    setPokemon(e.target.innerText.toLowerCase());
    console.log(pokemon);
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
          <button onClick={handleSearch}>Search</button>
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
                  <td>{move.move.name}</td>
                  <td>{move.version_group_details.move_learn_method.name}</td>
                  <td>{move.version_group_details.level_learned_at}</td>
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
