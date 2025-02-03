import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

const TOKEN_CONTRACTS = {
  USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
};

const getAccountBalance = async (address) => {
  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getTransactionHistory = async (address) => {
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getTokenBalance = async (address, token) => {
  try {
    const contractAddress = TOKEN_CONTRACTS[token];
    const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getGasEstimations = async (fromAddress, toAddress, value = "0x0") => {
  try {
    const url = `https://api.etherscan.io/api?module=proxy&action=eth_estimateGas&from=${fromAddress}&to=${toAddress}&value=${value}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export {
  getAccountBalance,
  getTransactionHistory,
  getTokenBalance,
  getGasEstimations,
};
