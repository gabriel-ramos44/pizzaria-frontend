import { useState } from 'react';
import axios from 'axios';

interface Pizza {
  size: string;
  flavor: string;
  customizations?: string[];
}

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  const createOrder = async (pizzas: Pizza[]) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/orders', { pizzas });
      console.log(response);

      if (response.data.error) {
        setError(response.data.error);
        setOrder(null);
        throw new Error(response.data.error);
      } else {
        setOrder(response.data);
        setError(null);
      }
    } catch (err) {
      setError('Erro ao criar o pedido.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { order, createOrder, loading, error };
}