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

- **Cabeçalho fixo**: acompanha a página. Fica transparente sobre a foto do topo e ganha fundo azul-marinho quando a pessoa rola. No celular, os links ficam num menu.
1. **Topo**: foto em tela cheia, o lema "Seu lazer em boas mãos" com a parte de baixo das letras ondulando como se estivesse debaixo d'água, e o botão "Pedir orçamento no WhatsApp".
2. **Serviços**: uma lista com espaço para respirar: construção, instalação e troca de vinil, estampas e reformas, cada um com sua foto. Cada link "Orçar…" já marca o serviço no simulador.
3. **Antes e depois**: um slider que se arrasta com o dedo, com o mouse ou com as setas do teclado.
4. **Escolha a estampa**: cabe numa tela só. Ao tocar numa amostra, aparece uma piscina pronta em 3D (deque de pedra, borda, paredes e fundo) revestida com aquela estampa: a água baixa, o revestimento troca e a piscina enche de novo. O botão "Usar no orçamento" leva a escolha para o simulador.
5. **Monte seu orçamento**: serviço, tamanho aproximado, medidas, estampa, nome e bairro. O visitante vê a mensagem como ela vai chegar e o botão abre o WhatsApp `(15) 98824-0116` com o texto pronto. Nenhum preço aparece.
6. **Do contato à entrega**: as quatro etapas (contato, visita, execução e entrega). No computador, o painel abre ao passar o mouse, com o texto logo abaixo do título e a foto ao lado. No celular, abre ao tocar.
7. **Nota 5,0 no Google**: a nota, as 61 avaliações, o que os clientes elogiam e uma fileira de avaliações rolando para a direita (pausa ao passar o mouse). Os textos ainda são provisórios, à espera das avaliações reais.
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
| Logotipo | `assets/img/logo-belcor.svg` | Redesenhado em vetor a partir da arte da Belcor (veja a seção Logo abaixo). |
| Estampas de vinil | `index.html`, padrões `p-…` e amostras `.swatch` | São 8 desenhos **ilustrativos** com nomes genéricos. Troque pelo catálogo real: pode ser uma foto de cada amostra no lugar do desenho. |
| Foto real de obra por estampa | `index.html`, amostras `.swatch` | Coloque `data-obra="assets/img/obras/nome.webp"` no `<input>` da amostra e a foto da obra aparece no lugar da piscina desenhada. |
| Cores da marca | `assets/css/style.css`, bloco `:root` | Tiradas do logo: azul-marinho #013b5e, as quatro faixas (#48e0fa, #92f7fe, #a3bae4, #2252bf) e o amarelo do lema nas estrelas. |
| Avaliações do Google | `index.html`, seção `avaliacoes` | A fileira que rola tem 6 cartões com texto provisório. Troque iniciais, nome, texto e data pelas avaliações reais, nas duas listas (a segunda é a cópia que fecha o laço). |

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

## Logo

O logo foi redesenhado em vetor a partir da arte enviada pela Belcor. As quatro faixas têm as mesmas proporções e cores do original, e o nome usa a fonte **Satisfy** (Google Fonts, licença livre), convertida em contornos, então o arquivo não depende de fonte instalada.

| Arquivo | Uso |
| --- | --- |
| `logo/belcor-logo-branco.svg` | vetor, nome em branco, para fundo escuro (é o que o site usa) |
| `logo/belcor-logo-azul.svg` | vetor, nome em azul-marinho, para fundo claro |
| `logo/belcor-logo-branco.png` | 3000 px, fundo transparente |
| `logo/belcor-logo-azul.png` | 3000 px, fundo transparente |
| `logo/belcor-logo-branco-fundo-azul.png` | 3600 px, já com o fundo azul-marinho #013b5e |

Cores: #48e0fa, #92f7fe, #a3bae4, #2252bf e o fundo #013b5e.

## Velocidade e SEO

Medido com o Lighthouse (o mesmo do Google PageSpeed), simulando um celular:

| | Antes | Depois |
| --- | --- | --- |
| Desempenho | 83 | 99 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 |
| Primeira pintura | 1,7 s | 0,8 s |
| Maior elemento na tela | 3,5 s | 2,1 s |
| Tempo travado | 320 ms | 0 ms |

O que foi feito: fonte hospedada no próprio site, fotos em duas larguras (o celular baixa a de 640 px), animações que só rodam quando estão na tela, dados estruturados da empresa (Google), título e descrição com "piscinas em Sorocaba", `robots.txt`, `sitemap.xml` e arquivos de cache/compressão para Apache (`.htaccess`), Netlify (`netlify.toml`) e Vercel (`vercel.json`).

**Ao publicar:**
1. Troque `https://www.SEUDOMINIO.com.br` pelo endereço real em `index.html`, `robots.txt` e `sitemap.xml`.
2. Cadastre o site no Google Search Console e envie o `sitemap.xml`.
3. Coloque o endereço do site no perfil da Belcor no Google (Google Meu Negócio) e no Instagram.
4. Ao mudar `style.css` ou `main.js`, aumente o número em `?v=3` no `index.html` para os navegadores baixarem a versão nova.
