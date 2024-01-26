# Marcuthcraft - Minecraft 2D Fan Game

![Tela inicial](https://cdn.discordapp.com/attachments/922262554087137341/1200233544610480148/image.png?ex=65c56f98&is=65b2fa98&hm=0b09743fde6f0af95f0632adc0e7ebf14e38de42f2802b904f743d547153eaa9&)

## Jogar

- [Link 1: Netlify](https://marcuthcraft.netlify.app/)
- [Link 2: GitHub](https://1marcuth.github.io/marcuthcraft/)

## Anotações

### Calcular X, Y global

```ts
const y = Math.floor(blockIndex / chunkWidth)
const x = chunkIndex * chunkWidth + Math.floor((blockIndex + 1) % chunkWidth)
```