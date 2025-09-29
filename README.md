# Le sytème de restriction de temps d'écran sur téléphone

Un sytème de restriction de temps d'écran fonctionne comme **une barrière logicielle** : il limite l'accès à un appareil ou à certaines applications après une durée définie par un parent. Ces sytèmes sont integrés dans les téléphones mais peuvent être ajoutés via des applications tierces.

#### Voici une liste d'applications de contrôle parental :


- [Google Family Link](https://families.google/familylink/)
- [Qustodio](https://www.qustodio.com)
- [Net Nanny](https://www.netnanny.com)
- [Kaspersky Safe Kids](https://www.kaspersky.fr/safe-kids)
- [Microsoft Family Safety](https://www.microsoft.com/fr-fr/microsoft-365/family-safety)

#### Fonctionnement

1. **Paramétrages parental** : choix d'un temps maximum d'utilisation par jour, horaires de repos, applis autorisées, ...
2. **Blocage automatique** : une fois le temps écoulé, l'accès est verrouillé et nécessite un code parental.
3. **Surveillance** : rapports d'usage envoyés au parents, localisation en temps réels, lecture d'écran...

---

## Contournement basiques

| Avec les parents | Systèmes | Autres |
|--|--|--|
| Enregistrer une vidéo de l'écran au moment où le parent saisit son mot de passe | Changer l'heure du système pour tromper le compteur | Utiliser un autre appareil (ordinateur, tablette, téléphone d'un ami) |
| Emprunter ou demander le code parental | Créer un second compte utilisateur ou utiliser le compte invité | Utiliser un navigateur alternatif ou un VPN pour contourner le filtrage web |
| Négocier, comprendre les inquiétude des parents et proposer une autre solution | Désinstaller l'application de contrôle parental si elle n'est pas protégée par un mot de passe | Installer des applications masquées ou des clones d'applications pour accéder aux réseaux sociaux |
|  | Réinitialiser l'appareil pour effacer les restrictions | |
|  | Activer le mode avion / bloquer la connexion réseau (certains contrôles nécessitent Internet) ||

## Contournement complexes avec logiciels tiers

| Nom du logiciel / technique          | Description                                                                                                 | Pourquoi il est efficace                                         |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| VPN (Virtual Private Network)        | Outils comme NordVPN, ExpressVPN, ou des VPN gratuits. Chiffrent la connexion et masquent l’IP.             | Masque le trafic réel ; certains contrôles se basent sur le réseau. |
| Proxy HTTP/HTTPS                     | Serveurs intermédiaires (ex : ProxyFire, Squid) qui redirigent le trafic.                                  | Contourne les filtres DNS ou les bloqueurs d’URL.                 |
| Utilisation d’un autre compte utilisateur | Créer un second profil sur Android/iOS ou se connecter à un autre compte Google/Apple.                      | Les paramètres de Temps d’écran sont souvent liés au compte, pas à l’appareil. |
| Applications “unblocker”             | Apps comme *Freedom*, *Cold Turkey* (Android) ou des scripts personnalisés.                               | Bloque les restrictions applicatives en interférant avec le système d’exploitation. |
| Réinitialisation du routeur / changement de DNS | Modifier l’adresse DNS sur le routeur (Google DNS, Cloudflare 1.1.1.1).                                 | Désactive les filtres de temps d’écran basés sur DNS.             |
| Applications de contournement d’API  | Par exemple *AppBlock* ou *Offtime* sur Android qui offrent des options de "bypass".                       | Permet à l’utilisateur de désactiver temporairement les restrictions via un menu caché. |
| Modification du système (root/jailbreak) | Rooter un appareil Android ou jailbreaker un iPhone.                                                        | Donne contrôle complet ; permet d’installer des applis non vérifiées. |
| Utilisation de “screen‑time bypass” apps | Applications dédiées (ex : *Screen Time Bypass* pour Android) qui exploitent des vulnérabilités du système. | Ciblent spécifiquement les mécanismes de contrôle et les désactivent sans root/jailbreak. |
| Redémarrage en mode “Safe Mode”      | Sur Android, démarrer l’appareil en Safe Mode (maintenir le bouton d’alimentation > « Redémarrer »).        | Les applications tierces sont désactivées, y compris celles qui appliquent les restrictions. |
| Utilisation de services cloud pour l’accès à distance | Accès à un ordinateur ou une tablette via des plateformes comme TeamViewer ou Chrome Remote Desktop. | Permet d’utiliser des applis sur un appareil non restreint depuis le téléphone. |

## Applications tierces

- [App Ops](https://appops.rikka.app/)
- [Freedom](https://freedom.to/freedom-for-android)
- [StayFocused](https://www.stayfocusd.com/)
