# Tec Toque Segurança Eletrônica — Site institucional

Site institucional completo, exclusivo e estático (HTML + CSS + JS puro),
pronto para publicar na **Vercel**.

## Estrutura

```
.
├── index.html              → página única com todas as seções
├── css/styles.css          → design system e estilos
├── js/main.js              → interações (menu, galeria, lightbox, formulário)
├── assets/
│   ├── logo-mark.svg        → símbolo (cabeçalho)
│   ├── logo-mark-white.svg  → símbolo (rodapé)
│   ├── favicon.svg          → ícone do site
│   ├── galeria/             → ilustrações dos equipamentos (SVG)
│   └── videos/              → coloque aqui os vídeos reais (.mp4)
├── vercel.json             → configuração de deploy
├── robots.txt
└── sitemap.xml
```

## Seções

Cabeçalho fixo → Hero → Faixa de informações → Sobre → Serviços (9 cards) →
Galeria (filtros + lightbox + vídeos) → Diferenciais → Região → Contato/Orçamento → Rodapé.

## Contato configurado

- WhatsApp: `5522999847120` → botões usam `https://wa.me/5522999847120`
- Instagram: `@tectoque` → `https://instagram.com/tectoque`

Todos os botões de WhatsApp têm o atributo `data-wa`; o `js/main.js` monta o link
com mensagem pronta. O formulário gera a mensagem com nome, telefone, serviço e
mensagem opcional, e abre o WhatsApp — sem e-mail e sem cadastro.

## Colocar as fotos e vídeos reais

### Fotos da galeria
As imagens atuais em `assets/galeria/*.svg` são ilustrações próprias dos
equipamentos. Para usar **fotos reais** (preserve o formato original — jpg/png/webp):

1. Salve as fotos em `assets/galeria/`.
2. No `index.html`, troque o `src` de cada `<figure class="shot">` pela sua foto,
   por exemplo: `src="assets/galeria/camera-entrada.jpg"`.
3. Mantenha o `alt` e os atributos `data-title` / `data-desc` (usados no lightbox).

O hero e a seção "Sobre" também usam imagens — troque os `src` correspondentes
pelas fotos reais da empresa/equipamentos.

### Vídeos
Coloque em `assets/videos/` com estes nomes:

- `instalacao-camera.mp4`
- `monitoramento-24h.mp4`
- `automacao-portao.mp4`

Eles passam a aparecer automaticamente com player nativo (controles e áudio).
Enquanto não existirem, o site mostra um aviso amigável com botão de WhatsApp.
Para adicionar mais vídeos, duplique um `<article class="video-card" data-optional>`
e ajuste `src`, `poster` e a legenda.

### Logo
A logomarca completa e oficial do cliente é usada exatamente como é:
- `assets/brand/logo.png` → logo completa (emblema + "TECTOQUE" + faixa), com o fundo tratado e bordas limpas. Usada no cabeçalho, no menu mobile e no rodapé (sobre um painel branco, para manter as cores originais no fundo escuro).
- `assets/galeria/logo.png` → arquivo original enviado pelo cliente (preservado).
- `assets/favicon.png` e `assets/apple-touch-icon.png` → ícones gerados a partir do emblema.

## Publicar na Vercel

Opção 1 — pelo painel:
1. Envie esta pasta para um repositório no GitHub.
2. Na Vercel, "Add New Project" → importe o repositório.
3. Framework Preset: **Other**. Build Command: vazio. Output Directory: `./`.
4. Deploy.

Opção 2 — pela CLI:
```bash
npm i -g vercel
vercel
```

Ao apontar o domínio próprio, atualize a URL em `index.html` (canonical/Open Graph),
`robots.txt` e `sitemap.xml`.

## Testes recomendados antes de publicar

- Navegação do menu (desktop e mobile) e rolagem suave.
- Filtros da galeria e abertura/zoom das fotos (teclado: ← → Esc).
- Reprodução dos vídeos (após adicionar os arquivos).
- Formulário: validação e abertura do WhatsApp com a mensagem correta.
- Responsividade em celular, tablet e desktop.
- Links do rodapé, Instagram e WhatsApp.
