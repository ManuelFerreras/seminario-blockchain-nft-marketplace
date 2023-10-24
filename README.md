# 🚀 Mercado NFT del Seminario Blockchain

¡Hola! Acá vas a encontrar todo lo que necesitás para arrancar con los contratos y la app descentralizada (DApp) del Marketplace.

## ¿Qué vas a encontrar acá?
- [Contratos Inteligentes](#contratos-inteligentes)
- [DApp - La App del Marketplace](#dapp---la-app-del-mercado)
- [Como correrlo en tu compu](#para-correrlo-en-tu-compu)
- [Demo online](#mirá-cómo-quedó-online)

---

## 📁 Contratos Inteligentes

Todos los contratos que armamos están en la carpeta `./contracts`.

### ¿Cómo probar los Contratos?

Tenés que correr este comando:

```bash
truffle test
```
---

## 🌐 DApp - La App del Mercado

Nuestra app del mercado está en `./dapp`. La hicimos con Next.js, ethers y wagmi.

### Configurá tu entorno

Antes de que arranques la app, tenés que configurar algunas cositas. Creá un archivo que se llame `.env.local` en la carpeta `./dapp` y poné adentro:

```env
NEXT_PUBLIC_MARKETPLACE_ADDRESS=PonéTuDirecciónDeMercadoAcá
NEXT_PUBLIC_TOKEN_ADDRESS=PonéTuDirecciónDeTokenAcá
NEXT_PUBLIC_NFTS_ADDRESS=PonéTuDirecciónDeNFTsAcá
```

No te olvides de cambiar esas direcciones por las reales. Los utilizados para la demo fueron:
```console
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0xF955A9C7dD03154a51e77d4d01718CCAA324e9B1
NEXT_PUBLIC_TOKEN_ADDRESS=0xaDE50349801846DCCf241B8Cf5d95a4aDAC8832F
NEXT_PUBLIC_NFTS_ADDRESS=0x7f1821Cb85595B4772D4A6a79C44F25aa37AC23B
```

---

## 🖥️ Para correrlo en tu compu

Una vez que ya tenés todo listo, seguí estos pasos:

1. Instalá todo lo que necesitás:

```bash
npm install
```

2. Arranca el servidor:

```bash
npm run dev
```

Después de eso, abrí tu navegador y poné `http://localhost:3000/`.

---

## 🌍 Mirá cómo quedó online

La app está online acá:

[https://seminario-blockchain-nft-marketplace.vercel.app](https://seminario-blockchain-nft-marketplace.vercel.app)

---

¡Cualquier cosa, me avisás! 🚀🔗🎨
