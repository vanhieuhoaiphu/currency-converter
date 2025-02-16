import { useEffect, useMemo, useState } from "react";
import useDebounce from "./useDebounce";

function App() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputAmount, setInputAmount] = useState(0);
  const [baseCurrencyPrice, setBaseCurrencyPrice] = useState(0);
  const [targetCurrencyPrice, setTargetCurrencyPrice] = useState(0);
  const debouncedAmount = useDebounce(inputAmount, 500);

  const convertedValue = useMemo(() => {
    return (baseCurrencyPrice / targetCurrencyPrice) * debouncedAmount || 0;
  }, [debouncedAmount, baseCurrencyPrice, targetCurrencyPrice]);

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPrices(data);
        setBaseCurrencyPrice(data?.at(0).price || 0);
        setTargetCurrencyPrice(data?.at(0).price || 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="converter-card">
        <h1 className="title">Currency Converter</h1>

        <div className="form-group">
          <label htmlFor="baseCurrency">Base Currency</label>
          <select
            id="baseCurrency"
            onChange={(e) => setBaseCurrencyPrice(e.target.value)}
            defaultValue={prices[0]?.price.toString()}
          >
            {prices.map((item) => (
              <option key={item.currency + item.price} value={item.price}>
                {item.currency} - {item.price}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="targetCurrency">Target Currency</label>
          <select
            id="targetCurrency"
            onChange={(e) => setTargetCurrencyPrice(e.target.value)}
            defaultValue={prices[0]?.price.toString()}
          >
            {prices.map((item) => (
              <option
                key={item.currency + item.price + "target"}
                value={item.price}
              >
                {item.currency} - {item.price}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="inputAmount">Amount</label>
          <input
            id="inputAmount"
            type="number"
            min={0}
            placeholder="Enter amount"
            onChange={(e) => setInputAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="convertedValue">Converted Amount</label>
          <input
            id="convertedValue"
            type="text"
            value={convertedValue.toLocaleString()}
            readOnly
            className="readonly-input"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
