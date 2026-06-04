import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_COIN_API_URL;

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  [key: string]: any; 
}

const CoinDetailsPage = () => {
    const {id} = useParams();
    const [coin, setCoin] = useState<CoinData| null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
 
useEffect(() => {
  const fetchCoin = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/${id}`); 
      if (!res.ok) throw new Error('Failed to fetch coin data');
      const data: CoinData = await res.json();
      console.log(data)
      setCoin(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  fetchCoin();
}, [id]);

    return (
        <>
          <h1>{coin?.name}</h1>
        </>
    )
}

export default CoinDetailsPage 