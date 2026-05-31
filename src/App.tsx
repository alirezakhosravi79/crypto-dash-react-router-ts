import { useEffect, useState } from "react";
import CoinCard from "./components/CoinCard";
import LimitSelector from "./components/LimitSelector";
import FilterInput from "./components/FilterInput";
import SortSelector from "./components/SortSelector";

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
  const [sortBy, setSortBy] =
    useState<SortOption>("market_cap_desc");

  useEffect(() => {
    const fetchCoins = async (): Promise<void> => {
      try {
        const res: Response = await fetch(
          `${API_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: Coin[] = await res.json();
        setCoins(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [limit]);

const filteredCoins = coins
  .filter(
    (coin) =>
      coin.name.toLowerCase().includes(filter.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(filter.toLowerCase())
  )
  .slice() // 🔥 Important: make a shallow copy before sorting!
  .sort((a, b) => {
    switch (sortBy) {
      case 'market_cap_desc':
        return b.market_cap - a.market_cap;
      case 'price_desc':
        return b.current_price - a.current_price;
      case 'price_asc':
        return a.current_price - b.current_price;
      case 'change_desc':
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
      case 'change_asc':
        return a.price_change_percentage_24h - b.price_change_percentage_24h;
      default:
        return 0;
    }
  });

  return (
    <div>
      <h1>🚀 Crypto Dash</h1>

      {loading && <p>Loading...</p>}

      {error && <div className="error">{error}</div>}

      <div className="top-controls">
        <FilterInput
          filter={filter}
          onFilterChange={setFilter}
        />

        <LimitSelector
          limit={limit}
          onLimitChange={setLimit}
        />

        <SortSelector
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {!loading && !error && (
        <main className="grid">
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))
          ) : (
            <p>No Matching Coins</p>
          )}
        </main>
      )}
    </div>
  );
}

export default App;