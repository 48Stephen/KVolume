<!DOCTYPE html>
<html>
  <head>
    <title>Kwenta Volume Bot</title>
  </head>
  <body>
    <h1>Kwenta Volume Bot</h1>
    <p>
      This is a Discord bot that retrieves and displays the rolling 24-hour
      trading volume of Kwenta futures contracts, priced in USD. The bot uses
      the
      <a href="https://thegraph.com/explorer/subgraph/kwenta/optimism-main"
        >Kwenta Optimism Mainnet subgraph</a
      >
      to calculate the volume and the
      <a href="https://www.coingecko.com/api/documentations/v3"
        >Coingecko API</a
      >
      to retrieve the current ETH/USD exchange rate.
    </p>



<h2>Getting Started</h2>
<ol>
  <li>
    Clone the repository:
    <code>git clone https://github.com/your_username/your_project.git</code>
  </li>
  <li>Install dependencies: <code>npm install</code></li>
  <li>
    Create a <code>.env</code> file in the project root directory and add
    your Discord bot token as <code>BOT_SECRET</code>
  </li>
  <li>Start the bot: <code>npm start</code></li>
</ol>

<h2>Usage</h2>
<p>
  The bot will update its username every hour to display the rolling
  24-hour trading volume of Kwenta futures contracts priced in USD.
</p>

<h2>Built With</h2>
<ul>
  <li>
    <a href="https://nodejs.org/en/">Node.js</a> - The runtime environment
    for the bot
  </li>
  <li>
    <a href="https://discord.js.org/">Discord.js</a> - The library used to
    interact with the Discord API
  </li>
  <li>
    <a href="https://github.com/axios/axios"
      >Axios</a
    > - Promise-based HTTP client for making requests to APIs
  </li>
  <li>
    <a href="https://github.com/MikeMcl/decimal.js/"
      >Decimal.js</a
    > - Library for arbitrary-precision decimal and non-decimal arithmetic
  </li>
</ul>

<h2>License</h2>
<p>
  This project is licensed under the MIT License - see the
  <a href="LICENSE">LICENSE</a> file for details.
</p>

  </body>
</html>