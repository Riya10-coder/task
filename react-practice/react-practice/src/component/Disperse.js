import React, { useState } from 'react';
import '../App.css';
function Disperse() {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [uniqueAddresses, setUniqueAddresses] = useState([]);
  const [combinedBalances, setCombinedBalances] = useState({});
  const [uniqueBalances, setUniqueBalances] = useState({});
  const onSubmit = () => {
    if (inputValue.trim() === '') {
      setError('\u24D8 Input cannot be empty');
      return;
    }
    const lines = inputValue.split('\n');
    const errorMessages = [];
    for (const [index, line] of lines.entries()) {
      const [address, balance] = line.split(/[,\s=]+/).filter((item) => item.trim());
      if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
        errorMessages.push(`\u24D8 Invalid address format in line ${index + 1}`);
        continue;
      }
      if (!/^\d+$/.test(balance)) {
        errorMessages.push(`\u24D8 Invalid balance format in line ${index + 1}`);
        continue;
      }
      if (!uniqueAddresses.includes(address)) {
        uniqueAddresses.push(address);
      } else {
        errorMessages.push(`\u24D8 Address ${address} encountered duplicate in line ${index + 1}`);
      }
      setCombinedBalances((prevBalances) => ({
        ...prevBalances,
        [address]: (prevBalances[address] || 0) + parseInt(balance, 10),
      }));
      setUniqueBalances((prevBalances) => ({
        ...prevBalances,
        [address]: parseInt(balance, 10),
      }));
    }
    if (errorMessages.length > 0) {
      const warningMessage = errorMessages.join('\n');
      setError(warningMessage);
    } else {
      setError(null);
    }
    setInputValue('');
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <div className='container'>
      <div className='wrapper'>
        <label>Address with Amounts</label>
        <textarea className='input'
          value={inputValue}
          onChange={handleInputChange}
          rows={10}
          cols={40}
        />
        <label>Separated by ',' or ' ' or '='</label>
        {error && (
          <div className="error-box">
            <div className="error-msg" dangerouslySetInnerHTML={{ __html: error }}></div>
          </div>
        )}
        <div>
          <button className='button'
            onClick={onSubmit}
          >
            Next
          </button>
        </div>
        <div>
          <h2>keepFirstOne</h2>
          <ul>
            {uniqueAddresses.map((address, index) => (
              <li key={index}>{`${address}: ${uniqueBalances[address]}`}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>combineBalances</h2>
          <ul>
            {Object.entries(combinedBalances).map(([address, balance]) => (
              <li key={address}>{`${address}: ${balance}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Disperse;
