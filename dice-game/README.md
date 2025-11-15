# 🎲 joujou, kostky kostkujou

Webová aplikace pro hru "joujou, kostky kostkujou" pro 1-100 hráčů, vytvořená v Reactu.

## Pravidla hry

Hra se hraje s pěti standardními kostkami (1-6 puntíků). Každý hráč má tři hody v každém kole:

1. **První hod** - házíte všemi kostkami
2. **Druhý hod** - můžete si odložit libovolné kostky a házet jen s vybranými
3. **Třetí hod** - opět můžete měnit, které kostky chcete házet
4. Po třetím hodu vyberete kategorii a zapíšete výsledek

### Výsledková listina

**První sekce (Čísla 1-6)**
- Pro splnění potřebujete minimálně 3 stejná čísla = ✓
- 4 stejná čísla = ✓ + hodnota 4. kostky
- 5 stejných čísel = ✓ + 2× hodnota kostky
- **Bonus:** Po splnění všech 6 čísel získáte 50 bodů + všechny plusy
- Pokud hráč na konci hry nemá splněných všech šest těchto kolonek, nedostává z nich žádné body

**Druhá sekce (Kategorie)**
1. **Dvojice** - 2 stejná čísla (body = součet dvojice)
2. **Trojice** - 3 stejná čísla (body = součet trojice)
3. **Čtveřice** - 4 stejná čísla (body = součet čtveřice)
4. **2+2** - dvě dvojice (body = součet všech 4 kostek)
5. **3+2** - trojice + dvojice (body = součet všech 5 kostek)
6. **Nízká postupka** - 1,2,3,4,5 (body = součet = 15)
7. **Vysoká postupka** - 2,3,4,5,6 (body = součet = 20)
8. **Poker** - 5 stejných čísel (body = součet + 50 bonusových bodů)
9. **Součet** - jakýkoliv hod (body = součet všech kostek)

Každou kategorii lze použít pouze jednou. Hra má celkem 15 kol. Pokud již nemáte volnou kategorii, kterou váš hod splňuje, musíte si některou kategorii škrtnout.

## Jak spustit aplikaci

### Instalace

```bash
npm install
```

### Spuštění vývojového serveru

```bash
npm run dev
```

Aplikace bude dostupná na `http://localhost:5173/`

### Build pro produkci

```bash
npm run build
```

Výsledné soubory budou v adresáři `dist/`

### Náhled produkční verze

```bash
npm run preview
```

## Technologie

- **React** - UI knihovna
- **Vite** - build tool a dev server
- Optimalizováno pro mobilní zařízení
- Responzivní design

## Licence

MIT
