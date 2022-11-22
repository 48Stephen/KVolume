require('dotenv').config() // Load .env file
const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client()
const botSecret = 'OTA4MzI0OTQwNjYxNTM4ODM2.G4711y.pvunbaUFNCUKGD3FMPkcRJ640M8MdRTzsOU2a4';



let count = -1;

console.log(count)

function getPrices() {

	if(count >= 4){
		count = 0;
		console.log("count reset")
	}else{
		count = count +1
	}

	
	axios.get(`https://api.llama.fi/protocol/hop-protocol`)
	.then((res) => {
		
		console.log(count)	
					
					
					let tvl = []
					let tvlOptimism = res.data.currentChainTvls.Optimism;
					let tvlEthereum = res.data.currentChainTvls.Ethereum;
					let tvlxDai = res.data.currentChainTvls.xDai;
					let tvlPolygon = res.data.currentChainTvls.Polygon;
					let tvlArbitrum = res.data.currentChainTvls.Arbitrum;
					tvl.push(
						{name: "Optimism", chainTvl: tvlOptimism},
					 	{name: "Ethereum", chainTvl: tvlEthereum}, 
						{name: "Gnosis", chainTvl: tvlxDai}, 
						{name: "Polygon", chainTvl: tvlPolygon}, 
						{name: "Arbitrum", chainTvl: tvlArbitrum});

					let num = Math.round(tvl[count].chainTvl).toString()
					



					if(num.length === 6){
						num = "$" + num.charAt(0) + num.charAt(1) + num.charAt(2) + " " + "k"
					};

					if(num.length === 7){
						num = "$" + num.charAt(0) + "." + num.charAt(1) + " " + "mil"
					};

					if(num.length === 8){
						num = "$" + num.charAt(0) + num.charAt(1) + " " + "mil"
					};



					console.log(tvl)

						client.user.setPresence({
							game: {
								
								name: `${tvl[count].name + " " + num}`
								
							}
							
						})
						
						//client.guilds.find(guild => guild.id === process.env.SERVER_ID).me.setNickname("Hop TVL")
						
					

				
				
			

			
	}
		).catch(err => console.log(err))
		
		
}


// Runs when client connects to Discord.
 client.on('ready', () => {
	console.log('Logged in as', client.user.tag)

	getPrices() 
	// Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
	setInterval(getPrices, Math.max(1, process.env.MC_PING_FREQUENCY || 1) * 60 * 1000)
})
console.log("hello")


client.login(`${botSecret}`)
 