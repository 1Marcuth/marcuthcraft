# Marcuthcraft - Minecraft 2D Fan Game

![Tela inicial](https://cdn.discordapp.com/attachments/922262554087137341/1200233544610480148/image.png?ex=65c56f98&is=65b2fa98&hm=0b09743fde6f0af95f0632adc0e7ebf14e38de42f2802b904f743d547153eaa9&)

## Jogar

- [Link 1: Netlify](https://marcuthcraft.netlify.app/)
- [Link 2: GitHub](https://1marcuth.github.io/marcuthcraft/)
- [Link 3: Vercel](https://marcuthcraft.vercel.app/)

## TODO:

- [ ] Desenvolvimento de Física do Jogo:
    - [ ] Implementar colisões e gravidade para interação com o jogador.
    - [ ] Adicionar física a blocos selecionados.
    - [ ] Integrar física à água para simulação realista.
- [ ] Animação do Jogador.
- [ ] Implementar Inventário do Jogador.
- [ ] Adicionar Sistema de Pontos de Vida.
- [ ] Introduzir Sistema de Pontos de Saturação.
- [ ] Permitir Importação de Skins.
- [ ] Implementar Tela de Criação de Mundo.
- [ ] Implementar Tela de Importação de Mundo.
- [ ] Implementar Tela de Exportação de Mundo.
- [ ] Aperfeiçoar Algoritmo de Geração de Terreno.
- [ ] Introduzir Criaturas (Mobs).
- [ ] Implementar Sistema de Iluminação.
- [ ] Adicionar Novos Tipos de Blocos.
- [ ] Expandir Variedade de Biomas.
- [ ] Desenvolver Sistema de Partículas para Efeitos Visuais.
- [ ] Criar Sistema de Comandos para Interatividade Avançada.
- [ ] Possibilitar Importação de Pacotes de Texturas.
- [ ] Integrar Funcionalidade Multiplayer.
- [ ] Integrar Servidores para Partidas Online.
- [ ] Adicionar Suporte para Mods.
- [ ] Implementar Tela de Créditos.
- [ ] Implementar Tela de Configurações/Opções. 

## Anotações

### Calcular X, Y global

```ts
const y = Math.floor(blockIndex / chunkWidth)
const x = chunkIndex * chunkWidth + Math.floor((blockIndex + 1) % chunkWidth)
```