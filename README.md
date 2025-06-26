# Servo Tony IA com Gemini

Projeto de chatbot espiritual cristão usando Gemini (Google AI).

## Como usar

1. Copie `.env.example` para `.env` e insira sua chave da API Gemini.

2. Instale dependências:
```
npm install
```

3. Rode localmente:
```
node server.js
```

4. O backend ficará ativo em `http://localhost:3000`

---

## Deploy no Vercel

1. Faça login no [Vercel](https://vercel.com) e importe este repositório.

2. Configure a variável de ambiente `GEMINI_API_KEY` com sua chave.

3. Defina o comando de start: `node server.js`

4. Defina domínio personalizado (`servotonyia.site`) no painel do Vercel e siga as instruções para DNS.

---

## Tecnologias usadas

- Node.js + Express  
- Google Generative AI (Gemini API)

---

## Contato

Projeto criado com ajuda do ChatGPT.
