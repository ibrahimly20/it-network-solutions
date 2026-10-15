# Site IT Network Solutions

Site vitrine statique (HTML/CSS/JS, sans étape de build), prêt pour GitHub Pages.

## Mise en ligne sur GitHub Pages
1. Pousser ces fichiers à la racine du dépôt (branche `main`).
2. Settings → Pages → Source : *Deploy from a branch*, branche `main`, dossier `/ (root)`.

## Domaine personnalisé
1. Ajouter un fichier `CNAME` à la racine contenant le domaine (ex. `www.itnetworksolutions.ne`), ou le saisir dans Settings → Pages → Custom domain.
2. Chez le registrar :
   - `www` : enregistrement CNAME vers `ibrahimly20.github.io`
   - domaine nu : 4 enregistrements A vers 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
3. Une fois le DNS propagé, cocher *Enforce HTTPS*.

## À personnaliser
- Téléphone et e-mail : `index.html` (section Contact) et `CONTACT_EMAIL` dans `assets/js/main.js`.
