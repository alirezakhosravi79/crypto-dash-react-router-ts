import { useEffect, useState } from "react";
import CoinCard from "./components/CoinCard";
import LimitSelector from "./components/LimitSelector";

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

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    const fetchCoins = async (): Promise<void> => {
      try {
        const res: Response = await fetch(
          `${API_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: Coin[] = await res.json();
        console.log(data);
        setCoins(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [limit]);

  return (
    <div>
      <h1>🚀 Crypto Dash</h1>
      {loading && <p>Loading....</p>}
      {error && <div className="error">{error}</div>}

      <LimitSelector limit={limit} onLimitChange={setLimit} />
      
      {!loading && !error && (
        <main className="grid">
          {coins.map((coin) => (
            <CoinCard coin={coin} key={coin.id} />
          ))}
        </main>
      )}
    </div>
  );
}

export default App;
