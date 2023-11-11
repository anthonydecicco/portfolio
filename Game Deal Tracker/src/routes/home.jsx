import { Link } from "react-router-dom";
import { useDealData } from "./layout"

export default function Home() {

    const dealData = useDealData();

    return (
        <>
            <ul>
                {dealData
                    .map((deal, gameID) => (
                        <Link key={deal.dealID} className="clear-hyperlink" to={'/game/' + deal.gameID}>
                            <li className="deal-listing" key={gameID}>
                                <div className="image-container">
                                    <img className="thumbnail" src={deal.thumb} />
                                </div>
                                <h1>{deal.title}</h1>
                                <p className="emphasize">Sale Price: ${deal.salePrice}</p>
                                <p>Retail Price: ${deal.normalPrice}</p>
                                <p>Metacritic Score: {deal.metacriticScore}</p>
                            </li>
                        </Link>
                    ))}
            </ul>
        </>
    )
}