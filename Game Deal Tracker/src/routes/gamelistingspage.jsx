import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function GameListingsPage() {
    const listOfGamesAPI = "https://www.cheapshark.com/api/1.0/games?title=";
    const { title } = useParams();
    const [listOfGames, setListOfGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (title) {
            getListOfGames();
        }
    }, [title]);

    async function getListOfGames() {
        const response = await fetch(listOfGamesAPI + title);
        if (response.status === 200) {
            const listOfGames = await response.json();
            setListOfGames(listOfGames);
            setIsLoading(false);
            console.log(listOfGames)
        } else {
            console.error("Error fetching game data. Response status:", response.status);
        }
    }

    return (
        <>
            {!isLoading ?
                <ul>
                    {listOfGames
                        .map((game) => (
                            <Link key={game.gameID} className="clear-hyperlink" to={`/game/${game.gameID}`}>
                                <li className="deal-listing">
                                    <div className="image-container">
                                        <img className="thumbnail" src={game.thumb} />
                                    </div>
                                    <h1>{game.external}</h1>
                                    <p className="emphasize">Cheapest Price: ${game.cheapest}</p>
                                </li>
                            </Link>
                        ))}
                </ul>
                : <></>}
        </>
    )

}