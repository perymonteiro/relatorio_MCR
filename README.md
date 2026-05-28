# Relatório MCR Widget

![Status](https://img.shields.io/badge/status-active-brightgreen)
![ArcGIS](https://img.shields.io/badge/ArcGIS-Experience%20Builder-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## Visão geral

Widget para **ArcGIS Experience Builder** que gera relatórios em PDF a partir de feições selecionadas em uma Feature Layer. Inclui cabeçalho institucional, dados do imóvel, campos de análise MCR e tabela de anos PRODES.

Repositório: [github.com/perymonteiro/relatorio_MCR](https://github.com/perymonteiro/relatorio_MCR)

---

## Funcionalidades

- Seleção de camada (Feature Layer) nas configurações
- Anos PRODES configuráveis (2019–2030)
- PDF com brasão e cabeçalho MMA
- Campos do registro: resultado, soma do desmatamento, critério, dentro do limite, UUID PRODES
- Tabela ano × área desmatada (ha)

---

## Estrutura do projeto

```
relatorio_MCR/
├── manifest.json
├── config.json
├── icon.svg
├── src/
│   ├── config.ts
│   ├── runtime/widget.tsx
│   ├── setting/setting.tsx
│   ├── assets/brasaobrasil.png
│   └── types/images.d.ts
├── tests/
└── dist/                 # build (npm run build:dev no client EXB)
    ├── runtime/widget.js
    └── setting/setting.js
```

---

## Instalação

### Opção A — Código-fonte (desenvolvimento)

1. Clone em `client/your-extensions/widgets/` do Experience Builder Developer:

```bash
git clone https://github.com/perymonteiro/relatorio_MCR.git relatorio_MCR
```

2. No diretório `client` do EXB, execute:

```bash
npm install
npm run build:dev
```

3. Inicie o EXB com `npm start` e use a widget na experience.

### Opção B — Build pronto (`dist/`)

1. Clone o repositório em `client/your-extensions/widgets/relatorio_MCR`.
2. A pasta `dist/` já contém os arquivos compilados; após `npm start`, a widget deve aparecer no builder.

---

## Configuração na experience

| Configuração | Descrição |
|--------------|-----------|
| **Camada** | Feature Layer com os dados MCR |
| **Anos PRODES** | Anos separados por vírgula (ex.: `2023, 2024`) |

---

## Uso

1. Configure a widget e a camada de dados.
2. Selecione uma feição na camada.
3. Clique em **Gerar PDF**.

---

## Dependências

- `jimu-core`, `jimu-ui`
- `jsPDF` (incluído no bundle do client EXB)

---

## Versão

Consulte `manifest.json`.

---

## Licença

MIT — ver [LICENSE](LICENSE).
