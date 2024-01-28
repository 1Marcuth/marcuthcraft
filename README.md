# Marcuthcraft - Minecraft 2D Fan Game

![Tela inicial](https://cdn.discordapp.com/attachments/922262554087137341/1200233544610480148/image.png?ex=65c56f98&is=65b2fa98&hm=0b09743fde6f0af95f0632adc0e7ebf14e38de42f2802b904f743d547153eaa9&)

## Jogar

- [Link 1: Netlify](https://marcuthcraft.netlify.app/)
- [Link 2: GitHub](https://1marcuth.github.io/marcuthcraft/)
- [Link 3: Vercel](https://marcuthcraft.vercel.app/)

## TODO:

- [ ] Desenvolver a física do jogo;
    - [ ] Adicionar colisões e gravidade em relação ao jogador;
    - [ ] Adiconar física para alguns blocos;
    - [ ] Adicionar física a água;
- [ ] Animar o jogador;
- [ ] Adiconar iventário do jogador;
- [ ] Adicionar pontos de vida do jogador;
- [ ] Adicionar pontos de saturação do jogador;
- [ ] Adicionar possibilidade de importar skin;
- [ ] Adicionar tela de criação de mundo;
- [ ] Adicionar tela de importação de mundo;
- [ ] Adicionar tela de exportação de mundo;
- [ ] Melhorar algoritmo de geração das camadas mais superficiais;
- [ ] Adicioar criaturas (mobs);
- [ ] Adicionar sistema de iluminação do jogo;
- [ ] Adicionar mais blocos;
- [ ] Adicionar mais biomas;
- [ ] Criar um sistema de partículas para efeitos visuais;
- [ ] Criar um sistema de comandos;
- [ ] Adicionar possibilidade de importação de pacote de texturas;
- [ ] Adicionar possibilidade de partidas multiplayer;
- [ ] Adicionar servidores;
- [ ] Adicionar possibilidade de uso de mods;

## Anotações

### Calcular X, Y global

```ts
const y = Math.floor(blockIndex / chunkWidth)
const x = chunkIndex * chunkWidth + Math.floor((blockIndex + 1) % chunkWidth)
```