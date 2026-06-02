import CoinCard from "../components/CoinCard";
import LimitSelector from "../components/LimitSelector";
import FilterInput from "../components/FilterInput";
import SortSelector from "../components/SortSelector";

import type { Coin, SortOption } from "../App";

interface HomeProps {
  coins: Coin[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  sortBy: SortOption;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
  loading: boolean;
  error: string | null;
}

function Home({
  coins,
  filter,
  setFilter,
  limit,
  setLimit,
  sortBy,
  setSortBy,
  loading,
  error,
}: HomeProps) {
  const filteredCoins = coins
    .filter(
      (coin) =>
        coin.name.toLowerCase().includes(filter.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(filter.toLowerCase())
    )
    .slice()
    .sort((a, b) => {
      switch (sortBy) {
        case "market_cap_desc":
          return b.market_cap - a.market_cap;

        case "price_desc":
          return b.current_price - a.current_price;

        case "price_asc":
          return a.current_price - b.current_price;

        case "change_desc":
          return (
            b.price_change_percentage_24h -
            a.price_change_percentage_24h
          );

        case "change_asc":
          return (
            a.price_change_percentage_24h -
            b.price_change_percentage_24h
          );

        default:
          return 0;
      }
    });

  return (
    <div>
      <h1>🚀 Crypto Dash</h1>

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

      {loading && <p>Loading...</p>}

      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid">
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
              />
            ))
          ) : (
            <p>No coins match your filter.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;