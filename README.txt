TibiaCore Discord Bot - paczka bez tokena

PLIKI W PACZCE:
- package.json
- app-config.js
- deploy-commands.js
- index.js
- .gitignore

CO ZROBIĆ DALEJ:

1. Wrzuć całą zawartość tego folderu na GitHub do repo TibiaCoreBot.

2. Na Railway:
   - New Project -> GitHub Repo -> TibiaCoreBot
   - Variables -> dodaj:
     DISCORD_BOT_TOKEN = TWÓJ_NOWY_BOT_TOKEN

3. Railway uruchomi bota komendą startową z package.json:
   npm start

4. Po deploy sprawdź logi. Powinno być:
   Logged in as Tibia Coach...

5. Komendę slash /link wgraj lokalnie raz z terminala:
   Windows CMD:
   set DISCORD_BOT_TOKEN=TWÓJ_NOWY_BOT_TOKEN
   npm install
   node deploy-commands.js

6. Potem bot 24/7 działa już z Railway.

WAŻNE:
- Nie wrzucaj tokena do GitHub.
- Jeśli token był kiedyś pokazany publicznie, zresetuj go w Discord Developer Portal przed użyciem.
- Client ID i Guild ID są już wpisane do app-config.js.
