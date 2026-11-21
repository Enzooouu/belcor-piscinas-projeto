# Belcor Piscinas: protótipo do site

Protótipo de site de uma página para a **Belcor Piscinas** (Sorocaba/SP), feito para apresentar ao dono da empresa.

- HTML, CSS e JavaScript puros, sem framework e sem etapa de build: abre rápido no celular.
- Para ver o site, abra o `index.html` no navegador ou publique a pasta em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger…).

## Estrutura

```
index.html            todo o conteúdo da página
assets/css/style.css  visual (cores e tamanhos ficam no topo, em :root)
assets/js/main.js     interações (antes/depois, estampas, simulador, passo a passo)
assets/img/           fotos (todas provisórias) e favicon
```

## Seções

1. **Topo**: foto em tela cheia, o lema "Seu lazer em boas mãos" com a parte de baixo das letras ondulando como se estivesse debaixo d'água, e o botão "Pedir orçamento no WhatsApp".
2. **Serviços**: construção, instalação e troca de vinil, estampas e reformas. Cada botão "Orçar…" já marca o serviço no simulador.
3. **Antes e depois**: um slider que se arrasta com o dedo, com o mouse ou com as setas do teclado.
4. **Escolha a estampa**: ao tocar numa amostra, o fundo da piscina desenhada muda, com reflexos de água em movimento. O botão "Usar esta estampa no orçamento" leva a escolha para o simulador.
5. **Monte seu orçamento**: serviço, tamanho aproximado, medidas, estampa, nome e bairro. O visitante vê a mensagem como ela vai chegar e o botão abre o WhatsApp `(15) 98824-0116` com o texto pronto. Nenhum preço aparece.
6. **Do contato à entrega**: as quatro etapas (contato, visita, execução e entrega) numa sanfona.
7. **Nota 5,0 no Google**: a nota, as 61 avaliações e os quatro pontos que os clientes elogiam. O botão leva às avaliações reais no Google. Não há depoimentos inventados.
8. **Sorocaba e região**: endereço, horário, WhatsApp e mapa do Google com o botão "Como chegar".
9. **WhatsApp fixo** no canto da tela. Ele some enquanto o botão do topo está visível, para não aparecer duas vezes.
10. **Rodapé**: o telefone em letras grandes, endereço, horário e Instagram @belcorpiscinas.

## Antes de publicar: o que trocar

Todos os pontos estão marcados no `index.html` com comentários `TROCAR`.

| O quê | Arquivo | Observação |
| --- | --- | --- |
| Foto do topo (computador) | `assets/img/hero-1920.webp` | 1920 × 1280, horizontal |
| Foto do topo (celular) | `assets/img/hero-828.webp` | 828 × 1242, vertical |
| Construção | `assets/img/construcao.webp` | 1100 × 800 |
| Reforma | `assets/img/reforma.webp` | 1100 × 800 |
| Antes / depois | `assets/img/antes.webp`, `assets/img/depois.webp` | 1400 × 900, **as duas tiradas do mesmo ângulo**. Hoje o "antes" é uma simulação feita a partir da foto do "depois", e por isso a legenda diz "Exemplo ilustrativo". |
| Fotos do passo a passo | `lazer.webp`, `vinil.webp`, `estampa.webp`, `area.webp` | de preferência fotos de obras da Belcor |
| Imagem de compartilhamento | `assets/img/og.jpg` | 1200 × 630, aparece quando o link é enviado no WhatsApp |
| Logotipo | `index.html`, classe `wordmark` | hoje o nome está escrito em texto |
| Estampas de vinil | `index.html`, padrões `p-…` e amostras `.swatch` | São 8 desenhos **ilustrativos** com nomes genéricos. Troque pelo catálogo real: pode ser uma foto de cada amostra no lugar do desenho. |
| Cores da marca | `assets/css/style.css`, bloco `:root` | Hoje as cores vêm da própria piscina (água, fundo azul, pedra da borda). Se a Belcor tiver cores oficiais, basta trocar ali. |

Ao trocar uma foto, salve em `.webp` com qualidade de 60 a 75 para o site continuar leve.

## Fotos provisórias (Unsplash)

Todas são do [Unsplash](https://unsplash.com/license), de uso livre. Nenhuma mostra uma obra da Belcor.

| Arquivo | Foto |
| --- | --- |
| hero-1920 / hero-828 / og | https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7 |
| construcao | https://images.unsplash.com/photo-1580587771525-78b9dba3b914 |
| reforma | https://images.unsplash.com/photo-1564013799919-ab600027ffc6 |
| depois (e antes simulado) | https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf |
| vinil | https://images.unsplash.com/photo-1571896349842-33c89424de2d |
| estampa | https://images.unsplash.com/photo-1562778612-e1e0cda9915c |
| lazer | https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3 |
| area | https://images.unsplash.com/photo-1613977257363-707ba9348227 |

## Informações usadas

Só informações públicas da empresa: nome, lema, serviços, área atendida, endereço, WhatsApp, horário, Instagram e a nota 5,0 com 61 avaliações no Google (com os pontos elogiados). Não há anos de mercado, número de obras, prêmios nem depoimentos.

Os textos que descrevem as etapas (por exemplo, "a equipe vai até o local para medir") são uma suposição razoável do processo. Confirme com o dono antes de publicar.
