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

  const handleSubmit = async () => {
    const formatPokemon = (str: string) => {
      return str.toLowerCase();
    };
    const url = `https://pokeapi.co/api/v2/pokemon/${formatPokemon(pokemon)}/`;

    const response = await fetch(url);

    const json = await response.json();

    const moves = json["moves"]
      .filter(isMoveGenIII)
      .map((move: any) => move.move);

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

        {moves.map((move: any) => (
          <div>
            <p>{move.name}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
