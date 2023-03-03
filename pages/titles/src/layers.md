index.js 
  -> é responsável por chamar todas as camadas

services -> 
 -> toda logica de negocio
 -> toda chamada externa

views 
  -> toda interação com o DOM (HTML, página)

controllers 
  -> é a intermediaria entre services e/ou workers e views

factories
  -> importa as dependencias
  -> cria objeto final para fazermos as chamadas
  -> retorna a função que inicializa o fluxo daquele componente (init)

workers
  -> toda logica PESADA (que envolva CPU)
  -> tudo que pode travar a tela (for loop, machine learning, AI, processamento de WEB CAM)
  -> ele chama as regras de negócio da service
