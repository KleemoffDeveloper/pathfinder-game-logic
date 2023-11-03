# PathFinder Adventure Game

ChatGPT + Dall-E Integration

<div align=center>
    <img src="./pathfinder-no-bg.png" width=256>
    <h1>How It Works</h1>
    <p>
    After learning the ins-and-outs of the ChatGPT API, we managed to come up with a system of generating a coherent story for a user to play through.
    </p>
    <a href="#game-logic">View Code</a>
    <h1>Problems we faced</h1>
    <p>- <b>Load Times:</b> As of 2023, the ChatGPT API is blatantly slow. Simple requests take upwards of 15 seconds to generate a response which breaks immersion and downgrades user experience. To address this issue, we had to create a mini-game for the user to play while the API was creating our response.</p>
    <p>- <b>Persistent Chat:</b> In order for the AI to remember your last response, you have to manually remind it by sending the entirety of your conversation each request. This poses an obvious problem due to the steady increase of tokens as the conversation continues.</p>
    <p>- <b>Paid Development:</b> To develop an appplication with OpenAI's APIs, you are going to have to spend some money. Thankfully, the usage rate is barely noticable if you're using the API in a controlled manner.</p>
</div>

# Game Logic

### Initializing the game session with ChatGPT

```js
const game = {
  context: "",
  choice: "",
  currentChoice: 0,
  maxChoices: 3,
};

const initialRequest = await openai.chat.completions.create({
  messages: [
      {
        role: "system",
        content: `We are playing an adventure game. Give me 3 choices to progress through the story. Make sure to label the title of the story and the main plot of the story. Label each choice with [Choice title] and [Choice plot].`,
      },
      {
        role: "user",
        content: "Start the game.",
      },
  ],
  temperature: 0.8,
  max_tokens: 500,
  model: "gpt-3.5-turbo",
});
```

### Setting the game context from the response
```js

```

### Continuing from user choice

```js
const continuation = await openai.chat.completions.create({
  messages: [
          {
            role: "system",
            content: `We are continuing an adventure game. Give me 3 choices to progress through the story until we reach the end. Choices until end: ${currentChoice}/${maxChoices}`,
          },
          {
            role: "user",
            content: `Context: ${game.context} My Choice: ${game.choice}`,
          },
  ],
  temperature: 0.8,
  max_tokens: 500,
  model: "gpt-3.5-turbo",
});
```
