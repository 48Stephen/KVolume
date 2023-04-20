require("dotenv").config(); // Load .env file
const axios = require("axios");
const Decimal = require('decimal.js');
const Discord = require("discord.js");
const client = new Discord.Client()

const botSecret = process.env.BOT_SECRET;

function formatUSD(number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(number);
}

function calculateVolume(data) {
  let totalVolume = new Decimal(0);

  // Calculate the rolling 24-hour volume
  for (let i = 0; i < data.length; i++) {
    totalVolume = totalVolume.plus(new Decimal(data[i].volume));

    // Subtract the volume from 24 hours ago
    if (i >= 24) {
      totalVolume = totalVolume.minus(new Decimal(data[i - 24].volume));
    }
  }
  
  const valueInEther = totalVolume.dividedBy(new Decimal(10).pow(18));

  return valueInEther;
}

function getETHPrice() {
  const currency = 'usd'; 
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency}`;

  return axios.get(url)
    .then(response => {
      const ethPrice = response.data.ethereum[currency];
      return ethPrice;
    })
    .catch(error => {
      throw new Error(`Failed to get ETH price: ${error.message}`);
    });
}

async function getVolume() {
  try {
    const ethPrice = await getETHPrice();

    const query = `
      {
        futuresAggregateStats(first: 25, where: {period: "3600"}, orderBy: timestamp, orderDirection: desc) {
          asset
          feesCrossMarginAccounts
          feesKwenta
          feesSynthetix
          id
          marketKey
          period
          timestamp
          trades
          volume
        }
      }
    `;

    const response = await axios.post("https://api.thegraph.com/subgraphs/name/kwenta/optimism-main", {query});
    const valueInEther = calculateVolume(response.data.data.futuresAggregateStats);
    const usdVolume = ethPrice * valueInEther;
    const formattedPrice = formatUSD(usdVolume);

    console.log(formattedPrice);
    client.user.setPresence({
      status: 'available',
      activity: {
        name: formattedPrice,
        type: 'PLAYING'
      }
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

client.on("ready", () => {
  client.user.tag = "Hi";
  console.log("Logged in as", client.user.tag);

 
})