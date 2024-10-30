// PrivacyPolicy.tsx
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', marginLeft: '100px' }
} >
      <h1>Politique de Confidentialité</h1>

      <section>
        <h2>Qui sommes-nous ?</h2>
        <p>
          Notre adresse de site Web est : <a href="https://kenzi.com/blonwe">https://kenzi.com/blonwe</a>.
        </p>
      </section>

      <section>
        <h2>Commentaires</h2>
        <p>
          Lorsque les visiteurs laissent des commentaires sur le site, nous collectons les données indiquées dans le formulaire de commentaires, ainsi que l'adresse IP du visiteur et la chaîne de l'agent utilisateur du navigateur pour aider à la détection des spams.
        </p>
      </section>

      <section>
        <h2>Médias</h2>
        <p>
          Si vous téléversez des images sur le site Web, vous devriez éviter de téléverser des images contenant des données de localisation intégrées (EXIF GPS). Les visiteurs du site Web peuvent télécharger et extraire toutes les données de localisation depuis les images du site.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Si vous laissez un commentaire sur notre site, vous pouvez choisir d'enregistrer votre nom, adresse e-mail et site Web dans des cookies. Ceux-ci sont pour votre commodité afin que vous n'ayez pas à remplir vos informations à nouveau lorsque vous laissez un autre commentaire. Ces cookies dureront un an.
        </p>
        <p>
          Si vous visitez notre page de connexion, nous établirons un cookie temporaire pour déterminer si votre navigateur accepte les cookies. Ce cookie ne contient aucune donnée personnelle et est supprimé lorsque vous fermez votre navigateur.
        </p>
      </section>

      <section>
        <h2>Contenu intégré d’autres sites</h2>
        <p>
          Les articles de ce site peuvent inclure du contenu intégré (par exemple des vidéos, des images, des articles, etc.). Le contenu intégré d'autres sites se comporte de la même manière que si le visiteur avait visité cet autre site.
        </p>
        <p>
          Ces sites Web peuvent collecter des données sur vous, utiliser des cookies, intégrer des suivis tiers supplémentaires et surveiller votre interaction avec ce contenu intégré.
        </p>
      </section>

      <section>
        <h2>Avec qui partageons-nous vos données ?</h2>
        <p>
          Si vous demandez une réinitialisation de mot de passe, votre adresse IP sera incluse dans l'e-mail de réinitialisation.
        </p>
      </section>

      <section>
        <h2>Combien de temps conservons-nous vos données ?</h2>
        <p>
          Si vous laissez un commentaire, le commentaire et ses métadonnées sont conservés indéfiniment. Cela permet de reconnaître et d'approuver automatiquement les commentaires suivants au lieu de les conserver dans une file de modération.
        </p>
      </section>

      <section>
        <h2>Quels droits avez-vous sur vos données ?</h2>
        <p>
          Si vous avez un compte sur ce site, ou si vous avez laissé des commentaires, vous pouvez demander à recevoir un fichier exporté des données personnelles que nous détenons sur vous, y compris les données que vous nous avez fournies. Vous pouvez également demander que nous effacions toutes les données personnelles que nous détenons sur vous. Cela ne comprend pas les données que nous sommes obligés de conserver à des fins administratives, juridiques ou de sécurité.
        </p>
      </section>

      <section>
        <h2>Où envoyons-nous vos données ?</h2>
        <p>
          Les commentaires des visiteurs peuvent être vérifiés via un service automatisé de détection de spam.
        </p>
      </section>

      <section>
        <h2>Informations de Contact</h2>
        <p>
          Si vous avez des questions sur cette politique de confidentialité, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:info@example.com">info@example.com</a>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
