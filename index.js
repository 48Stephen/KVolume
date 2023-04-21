require("dotenv").config();
const axios = require("axios");
const Decimal = require('decimal.js');
const Discord = require("discord.js");
const client = new Discord.Client();

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

  const currency = 'usd'; 
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency}`;

  axios.get(url)
    .then(response => {
      const ethPrice = response.data.ethereum[currency];
      const usdVolume = ethPrice * (totalVolume / Math.pow(10, 18));
      const formattedPrice = formatUSD(usdVolume);
      
      console.log(formattedPrice);
      client.user.setUsername(`${formattedPrice}`);
    })
    .catch(error => {
      console.log(`Error: ${error.message}`);
    });
}

function fetchData() {
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

  axios.post("https://api.thegraph.com/subgraphs/name/kwenta/optimism-main", {
    query,
  })
  .then((response) => {
    calculateVolume(response.data.data.futuresAggregateStats);
  })
  .catch((error) => {
    console.error(error);
  });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  fetchData();
  setInterval(fetchData, 60 * 60 * 1000);
});

client.login(botSecret);