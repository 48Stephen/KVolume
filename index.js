require("dotenv").config();
const axios = require("axios");
const Decimal = require('decimal.js');
const Discord = require("discord.js");
const client = new Discord.Client()

const botSecret = process.env.BOT_SECRET




function getVolume() {

  /* Format USD */
  function formatUSD(number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    return formatter.format(number);
  }

  let valueInEther;

  function calculateVolume(data) {
    let totalVolume = new Decimal(0);
    
    // Calculate the rolling 24-hour volume
    for (let i = 0; i < data.length; i++) {
      totalVolume = totalVolume.plus(new Decimal(data[i].volume));

      // Subtract the volume from 24 hours ago
      if (i >= 24) {
        totalVolume = totalVolume.minus(new Decimal(data[i - 24].volume));
      }
    
    valueInEther = totalVolume / Math.pow(10, 18);
  }
  

  const currency = 'usd'; 
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency}`;

  let ethPrice;
  let usdVolume;
  let formattedPrice = "";

  /* 
    Get eth price
    Set bot activity 
  */

  axios.get(url)
    .then(response => {
      ethPrice = response.data.ethereum[currency];
    
      usdVolume = ethPrice * valueInEther 
    
      formattedPrice = formatUSD(usdVolume, 'en-US', 'USD', 3);
      
      console.log(formattedPrice)
      
    })
    .catch(error => {
      console.log(`Error: ${error.message}`);
    });

  }

  /* Volume Data Query  */
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

    axios
      .post("https://api.thegraph.com/subgraphs/name/kwenta/optimism-main", {
        query,
      })
      .then((response) => {
        calculateVolume(response.data.data.futuresAggregateStats);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  /* call Kwenta volume Query  */
  fetchData() 

   
	
}

module.exports = getVolume;
console.log("hello");

client.on("ready", () => {
  client.user.setUsername(`${formattedPrice}`);
  client.user.tag = "Hi";
  client.user.setPresence({
    status: 'online',
    activity: {
      name: '24hr Volume',
      type: 'PLAYING',
    },
  });
  console.log(process.env.BOT_SECRET)
  console.log(formattedPrice)
  /* getVolume(); */
  setInterval(
    getVolume,
    60 * 60 * 1000
  );
});


client.login(`${botSecret}`);
