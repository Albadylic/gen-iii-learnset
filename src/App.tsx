import { useState } from "react";
import "./App.css";

function App() {
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gen III Moveset Checker</h1>
      </header>
      <main>
        <h3>Type a Pokemon</h3>
        <label htmlFor="pokemon_input">Enter the name of a Pokemon</label>
        <input type="text" name="pokemon" id="pokemon_input" />
        <button onClick={handleSubmit}>Go!</button>

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
      </main>
    </div>
  );
}

export default App;
