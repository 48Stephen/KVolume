require('dotenv').config() // Load .env file
const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client()
const botSecret = 'MTA0NTA4ODA4MjA5OTE4Nzc2Mg.GH4CHl.U50NFs5r_5Ym_GWr4qoNePX_cPML_0Srd3lP3U';



let count = -1;

console.log(count)

function getPrices() {

	if(count >= 2){
		count = 0;
		console.log("count reset")
	}else{
		count = count +1
	}

	
	axios.get(`https://api.dexscreener.com/latest/dex/pairs/optimism/0x36e42931A765022790b797963e42c5522d6b585a`)
	.then((res) => {
		let data = res.data;

		let priceUsd = data.pair.priceUsd
		let volume = data.pair.volume.h24
		let ethPrice = data.pair.priceNative
		let priceChange = data.pair.priceChange.h24

		let priceChangeFormatted = Math.round(priceChange)  + "%"
		
		let formattedVolume = Math.round(volume).toString()

		if (formattedVolume.length >= 4){
			formattedVolume = formattedVolume.charAt(0) + "k"
		}

		if (formattedVolume.length === 5){
			formattedVolume = formattedVolume.charAt(0) + formattedVolume.charAt(1) + "k"
			
		}
		if (formattedVolume.length === 6){
			formattedVolume = formattedVolume.charAt(0) + formattedVolume.charAt(1) + formattedVolume.charAt(2) + "k"
		}

		if (formattedVolume.length >= 7){
			formattedVolume = formattedVolume + "mil"
		}
		
		
					
					let array = [
						{name: "Eth Valuation", value: ethPrice},
						{name: "24hr Volume", value: formattedVolume},
						{name: "24hr Change ", value: priceChangeFormatted}
					];

					
					



					 
						 client.user.setPresence({
							game: {
								
								name: `${ array[count].name + " "+ array[count].value }`
								
							}
							
						})  
						
						client.guilds.find(guild => guild.id === process.env.SERVER_ID).me.setNickname("$"+`${priceUsd}`)
						
					

				
				
			

			
	}
		).catch(err => console.log(err))
		
		
}



 client.on('ready', () => {
	console.log('Logged in as', client.user.tag)

	getPrices() 
	
	setInterval(getPrices, Math.max(1, process.env.MC_PING_FREQUENCY || 1) * 60 * 100)
})
console.log("hello")


client.login(`${botSecret}`)
 