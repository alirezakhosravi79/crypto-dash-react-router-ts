import { useEffect, useState } from "react";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutPage from "./pages/About";
import Header from "./components/Header";

const API_URL: string = import.meta.env.VITE_API_URL;

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

export type SortOption =
  | "market_cap_desc"
  | "price_desc"
  | "price_asc"
  | "change_desc"
  | "change_asc";

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("market_cap_desc");

  useEffect(() => {
    const fetchCoins = async (): Promise<void> => {
      try {
        const res: Response = await fetch(
          `${API_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: Coin[] = await res.json();
        setCoins(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [limit]);

  return (
    <>
    <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              coins={coins}
              filter={filter}
              setFilter={setFilter}
              limit={limit}
              setLimit={setLimit}
              sortBy={sortBy}
              setSortBy={setSortBy}
              loading={loading}
              error={error}
            />
          }
        />

        <Route path="/about" element={ <AboutPage/> }/>
      </Routes>
    </>
  );
}

export default App;
