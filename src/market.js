import axios from "axios";
const url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,tether,ripple,polkadot,dogecoin,hawk-tuah,litecoin,cardano,usdcoin,tron,chainlink,shiba,pepe,dai,reploy,elon4afd,sui,bittensor,official-trump";

const getMarketData = async () => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export { getMarketData };
