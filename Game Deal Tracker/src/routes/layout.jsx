import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

const DealDataContext = createContext();

export default function Layout() {
    const baseAPILink = "https://www.cheapshark.com/api/1.0/deals?";
    const onSale = "&onSale=1"
    const hideDuplicates = "&hideDuplicates=1";
    const [dealData, setDealData] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [filter, setFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const searchInputRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const navBarRef = useRef();

    const filterOptions = [
        { value: "low-to-high", label: "Price Low to High", link: "&sortBy=price"},
        { value: "high-to-low", label: "Price High to Low", link: "&sortBy=price&desc=1" },
        { value: "a-to-z", label: "A to Z", link: "&sortBy=title"},
        { value: "z-to-a", label: "Z to A", link: "&sortBy=title&desc=1" },
        { value: "meta-high-to-low", label: "Metacritic High to Low", link: "&sortBy=metacritic"},
        { value: "meta-low-to-high", label: "Metacritic Low to High", link: "&sortBy=metacritic&desc=1" }
    ]
    //Created an object of filter options to make comparing values to links easy
    //When a filter is chosen (based on value), the appropriate label displays
    //and the appropriate link is concatenated within the getDealData function below

    useEffect(() => {
        getDealData();
        window.scrollTo(0, 0); //scroll to top after data is rendered
    }, [pageNumber, filter]);
    //This useEffect function is related only to fetching data
    //Rerender the page when a user goes the next or previous page
    //Rerender the page when a user filters the deals

    async function getDealData() {
        const response = await fetch(baseAPILink + convertFilterToLink(filter) + onSale + "&pageNumber=" + pageNumber + hideDuplicates);
        //Build API request in parts to allow user to select filters
        //"convertFilterToLink(filter)" converts an array value into the corresponding link for the API request
        if (response.status === 200) {
            const dealData = await response.json();
            setDealData(dealData);
            setIsLoading(false);
        } else {
            console.log("Error fetching data, response status: " + response.status);
        }
    }
    //Fetches data using Cheap Shark's free API
    //The API link is broken into separate parts to make filtering and page number changes easier

    function getPreviousPage() {
        if (pageNumber !== 0) {
            setPageNumber(pageNumber - 1);
            setIsLoading(true);
        }
    }
    
    function getNextPage() {
        setPageNumber(pageNumber + 1);
        setIsLoading(true);
    }

    function firstPage() {
        if (pageNumber !== 0) {
            setPageNumber(0);
            setIsLoading(true);
        }
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/games/${searchQuery}`);
            // Have to set "use" hooks in the body of the component
            // You can't use navigate in the rendered portion because it is equal to useNavigate
        }
    }
    //I still do not fully understand the above, go back to review

    function showSearchBar() {
        if (!isFiltering) {
            setIsSearching(!isSearching);
        } else {
            setIsFiltering(false);
            setIsSearching(!isSearching);
            //if the filtering state is true, then it should be set to false before showing the search field
            //this allows the user to switch between search and filter without having to click again
        }
        setSearchQuery('');

        setTimeout(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus(); // Set focus on the input element
            }
        }, 0); //  In some cases focus may not immediately happen, used setTimeout to make it work
    }

    function showFilterOptions() {
        if (!isSearching) {
            setIsFiltering(!isFiltering);
        } else {
            setIsSearching(false);
            setIsFiltering(!isFiltering);
            //if the searching state is true, then it should be set to false before showing filter options
            //this allows the user to switch between filter and search without having to click again
        } 
    }
    
    function handleFilter(e) {
        setFilter(e.target.value);
        setIsLoading(true);
    }
    //This sets the filter value based on the radio button that is clicked in the filter menu

    function handleClear() {
        if (filter !== "") {
            setFilter("");
        }
    }
    //This sets the state of the filter to an empty string, deselecting the current radio button
    
    function convertFilterToLink(filter) {
        const matchingFilter = filterOptions.find(filterOption => filterOption.value === filter);
        
        if (matchingFilter) {
            return matchingFilter.link;
        }
        else {
            return "";
        }
    }
    //This matches the current filter (from the radio button) with it's corresponding link within the
    //filterOptions array
    
    //Logic: For each filterOption, check to see if there is a match between the selected filter
    //       and the filterOption's value. If there is a match, set matchingFilter equal to the object in
    //       the filterOptions array that has the same value as the selected filter. If matchingFilter
    //       contains information, then return the matchingFilter's link (a string). If there wasn't a
    //       match, then return an empty string.

    useEffect(() => {
        const handler = (e) => {
            if (!navBarRef.current.contains(e.target)) {
                setIsFiltering(false);
                setIsSearching(false);
            };
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
        //DOM event listener must be removed (using a cleanup function) within useEffect
        //This prevents the event listener from continuing to use resources
        //When the event listener is removed, resources are released
    });
    //This useEffect function rerenders the page when a user clicks outside of the nav container
    //When the user clicks outside of the nav container, the open menu (search/filter) automatically closes

    useEffect(() => {
        const storedDarkMode = localStorage.getItem('darkMode');
        if (storedDarkMode) {
            setIsDarkMode(storedDarkMode === 'true');
        }
    }, [])

    useEffect(() => {
        const root = document.querySelector("#root");
       
        if (isDarkMode === true) {
            root.classList.add("dark-mode");
            console.log("dark mode is on");
        } else {
            root.classList.remove("dark-mode");
            console.log("dark mode is off");
        }
    }, [isDarkMode]);

    function toggleDarkMode() {
        const newDarkModeState = !isDarkMode;
        setIsDarkMode(newDarkModeState);
        localStorage.setItem('darkMode', newDarkModeState.toString());
    }

    return (
        <DealDataContext.Provider value={dealData} >
            {/* Wrap the entire component with data context so that child components can access
                the data -- eliminates the need to continually pass dealData as props to each of the
                nested components. */}
            <div ref={navBarRef}>
                <header>
                    <nav>
                        <ul className="nav-list white-text">
                            <li className="nav-list-item home-and-dark-mode">
                                <Link to="/" onClick={[firstPage]}>
                                    <img className="nav-picture" src="src\Images\gaming.png" />
                                </Link>
                                <label className="switch">
                                    <input type="checkbox" checked={ isDarkMode } onChange={toggleDarkMode} />
                                    <span className="slider round"></span>
                                </label>
                            </li>
                            {!location.pathname.includes('game/') && !location.pathname.includes(`games/`) && (
                                <li className="nav-list-item align-right" >
                                    <div className="search-button-container">
                                        <button className="no-background" onClick={showFilterOptions}>Filter</button>
                                    </div>
                                </li>
                            )}
                            <li className="nav-list-item" >
                                <img className={`nav-picture search ${isDarkMode ? "search-dark-mode" : ""}`} src="src\Images\search.png" onClick={showSearchBar} />
                            </li>
                        </ul>
                    </nav>
                </header>

                <div className={`search-bar-container ${isSearching ? "" : "hide"} ${isDarkMode ? "dark-mode" : ""}`}>
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="search"
                            placeholder="Search for a specific game"
                            className={`search-field ${isDarkMode ? "dark-mode" : ""}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            ref={searchInputRef}
                        />
                        <button type="submit" className="search-button">→</button>
                    </form>
                </div>

                {!location.pathname.includes('game/') && !location.pathname.includes(`games/`) && (
                    <div className={`filter-dropdown-container ${isFiltering ? "" : "hide"} ${isDarkMode ? "dark-mode" : ""}`}>
                        <ul className="filter-options-list">
                            {filterOptions.map(option => (
                                <li key={option.value} >
                                    <label>
                                        <input
                                            type="radio"
                                            name="filter"
                                            value={option.value}
                                            onChange={handleFilter}
                                            checked={filter === option.value}
                                        />
                                        {option.label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <button className="search-button" onClick={handleClear}>
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {/* When the isLoading state is false, show the content, when it is true, show Loading */}
            {!isLoading ?
                <main>
                    {!location.pathname.includes('game/') && !location.pathname.includes(`games/`) && (
                        <div className="page-button-container">
                            <button className={`arrow-button ${!(pageNumber === 0) ? "" : "hide"}`} onClick={getPreviousPage}>←</button>
                            <button className={`arrow-button ${!(pageNumber === 0) ? "" : "align-right"}`} onClick={getNextPage}>→</button>
                        </div>
                    )}

                    <div id="outlet-body">
                        <Outlet />
                    </div>

                    {!location.pathname.includes('game/') && !location.pathname.includes(`games/`) && (
                        <div className="page-button-container">
                            <button className={`arrow-button ${!(pageNumber === 0) ? "" : "hide"}`} onClick={getPreviousPage}>←</button>
                            <button className={`arrow-button ${!(pageNumber === 0) ? "" : "align-right"}`} onClick={getNextPage}>→</button>
                        </div>
                    )}
                </main>
                : <h1 className="loading">Loading...</h1>}

        </DealDataContext.Provider>
        //wrap the entire layout in the data context for children to access
    )
}

export function useDealData() {
    return useContext(DealDataContext);
}