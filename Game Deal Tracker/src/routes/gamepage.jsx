import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function GamePage() {
    const { gameID } = useParams();
    const [gameData, setGameData] = useState({});
    const [storeInfo, setStoreInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const gameAPI = "https://www.cheapshark.com/api/1.0/games?id=";
    const storeAPI = "https://www.cheapshark.com/api/1.0/stores";

    useEffect(() => {
        if (Object.keys(gameData).length === 0) {
            getGameData();
        }
    }, [gameData, gameID]);

    useEffect(() => {
        if (storeInfo.length === 0) {
            getStoreInfo();
        };
    }, [storeInfo])

    async function getGameData() {
        const response = await fetch(gameAPI + gameID);
        if (response.status === 200) {
            const gameData = await response.json();
            setGameData(gameData);
            setIsLoading(false);
            console.log(gameData)
        } else {
            console.error("Error fetching game data. Response status:", response.status);
        }
    }

    async function getStoreInfo() {
        const response = await fetch(storeAPI);
        const storeInfo = await response.json();
        setStoreInfo(storeInfo);
    }

    function findStoreName(gameStoreID) {
        //compare a storeID from one object to the storeIDs in an object with corresponding names
        const matchingStore = storeInfo.find(store => store.storeID === gameStoreID);

        if (matchingStore) {
            return matchingStore.storeName;
        } else {
            return "Store information unavailable";
        }
    }

    console.log(gameData);

    return (
        <>
            {!isLoading ?
                <div className="table-container">
                    <h1 className="game-title"> {gameData.info.title}</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Store:</th>
                                <th className="text-align-right">Price:</th>
                                <th className="text-align-right">Savings:</th>
                                <th className="text-align-right">Retail Price:</th>
                            </tr>
                        </thead>
                        <tbody>
                        {gameData.deals.sort((deal1, deal2) => (deal2.retailPrice - deal2.price) - (deal1.retailPrice - deal1.price)).map((deal) => (
                            <tr className="best-deal" key={deal.dealID}>

                                <td>
                                    <div>
                                    <Link className="store-links" to={'https://www.cheapshark.com/redirect?dealID=' + deal.dealID} target="_blank" rel="noopener noreferror">
                                        {findStoreName(deal.storeID)}
                                        </Link>
                                        </div>
                                </td>

                                <td className="text-align-right">${deal.price}</td>
                                <td className="text-align-right">${(deal.retailPrice - deal.price).toFixed(2)}</td>
                                <td className="text-align-right">${deal.retailPrice}</td>
                            </tr>
                        ))}
                            </tbody>
                    </table>
                </div>
                : <></>}
        </>
    )
}
