/**
 * Contenu des FAQ (utilisateurs + avocats) et propositions d'abonnements.
 * Source : "Features" (avril 2026).
 */

export interface FaqItem {
  question: string;
  /** Paragraphes de réponse (rendus chacun dans leur bloc). */
  answer: string[];
  /** Puces optionnelles affichées sous les paragraphes. */
  bullets?: string[];
}

export interface FaqGroup {
  /** Titre de groupe optionnel (ex : "Les abonnements"). */
  title?: string;
  items: FaqItem[];
}

// ═══════════════════════════════════════════════════════════════
//  FAQ UTILISATEURS
// ═══════════════════════════════════════════════════════════════

export const USER_FAQ: FaqItem[] = [
  {
    question: "Qu'est-ce que Gisèle ?",
    answer: [
      "Gisèle est un service en ligne qui vous aide à mieux comprendre votre situation juridique.",
      "En répondant à quelques questions, vous obtenez une synthèse du cadre légal applicable et des démarches possibles.",
    ],
  },
  {
    question: "Est-ce que Gisèle remplace un avocat ?",
    answer: [
      "Non. Gisèle ne fournit pas de conseil juridique personnalisé.",
      "Elle vous permet de mieux comprendre votre situation avant, si nécessaire, de consulter un avocat.",
    ],
  },
  {
    question: "Comment fonctionne le service ?",
    answer: [
      "Vous répondez à un questionnaire adapté à votre situation.",
      "À partir de vos réponses, Gisèle génère une synthèse des informations juridiques et des démarches envisageables.",
    ],
  },
  {
    question: "Est-ce que les informations sont personnalisées ?",
    answer: [
      "Les informations sont générées à partir de vos réponses, mais restent générales.",
      "Elles ne tiennent pas compte de toutes les spécificités de votre situation et ne remplacent pas l'analyse d'un professionnel.",
    ],
  },
  {
    question: "Que contient la fiche récapitulative ?",
    answer: ["Elle présente :"],
    bullets: ["le cadre juridique applicable à votre situation", "les démarches possibles"],
  },
  {
    question: "Puis-je utiliser Gisèle gratuitement ?",
    answer: ["Oui. Le questionnaire et la synthèse sont accessibles gratuitement."],
  },
  {
    question: "Suis-je obligé de contacter un avocat ?",
    answer: [
      "Non. Vous êtes totalement libre de poursuivre vos démarches seul ou de consulter un avocat.",
    ],
  },
  {
    question: "Comment suis-je mis en relation avec un avocat ?",
    answer: [
      "Si vous le souhaitez, vous pouvez être mis en relation avec des avocats correspondant à votre situation.",
      "Vous restez libre de choisir de poursuivre ou non avec l'un d'eux.",
    ],
  },
  {
    question: "Les avocats sont-ils vérifiés ?",
    answer: [
      "Oui. Les avocats présents sur la plateforme sont vérifiés afin de garantir leur qualité de professionnel habilité.",
    ],
  },
  {
    question: "Combien coûte un avocat ?",
    answer: [
      "Les honoraires sont fixés librement par chaque avocat.",
      "Ils vous seront précisés directement lors de vos échanges avec lui.",
    ],
  },
  {
    question: "Mes données sont-elles confidentielles ?",
    answer: [
      "Oui. Vos réponses sont utilisées uniquement pour générer votre synthèse et, si vous le souhaitez, pour faciliter la mise en relation avec un avocat.",
      "Elles sont traitées conformément à la réglementation en vigueur.",
    ],
  },
  {
    question: "Que se passe-t-il après la mise en relation ?",
    answer: [
      "Une fois le contact établi, vous échangez directement avec l'avocat.",
      "Gisèle n'intervient pas dans la suite de la relation ni dans le traitement de votre dossier.",
    ],
  },
  {
    question: "Puis-je utiliser Gisèle pour n'importe quel problème juridique ?",
    answer: [
      "Gisèle couvre de nombreuses situations du quotidien, mais certains cas spécifiques peuvent nécessiter directement l'intervention d'un avocat.",
    ],
  },
  {
    question: "Dans quels cas dois-je consulter un avocat ?",
    answer: [
      "Si votre situation est complexe, urgente ou nécessite une stratégie juridique, il est recommandé de consulter un avocat.",
      "Gisèle vous permet de faire un premier point, mais ne remplace pas un accompagnement professionnel.",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
//  FAQ AVOCATS
// ═══════════════════════════════════════════════════════════════

export const LAWYER_FAQ_GENERAL: FaqItem[] = [
  {
    question: "Quel type de demandes vais-je recevoir ?",
    answer: [
      "Vous accédez à des demandes préalablement structurées via un questionnaire guidé, qui correspondent à votre domaine d'expertise.",
      "Chaque situation comprend un premier niveau d'information (contexte, domaine juridique, éléments déclaratifs), vous permettant d'évaluer rapidement sa pertinence par rapport à votre activité.",
    ],
  },
  {
    question: "Les demandes sont-elles qualifiées ?",
    answer: [
      "Les demandes sont clarifiées en amont grâce au questionnaire et à la synthèse générée par Gisèle.",
      "Cela permet de mieux orienter les utilisateurs et de limiter les sollicitations imprécises, sans pour autant remplacer votre analyse professionnelle.",
    ],
  },
  {
    question: "Suis-je libre de répondre aux demandes ?",
    answer: [
      "Oui. Vous êtes totalement libre de répondre ou non aux demandes reçues, en fonction de leur pertinence et de votre disponibilité.",
    ],
  },
  {
    question: "Comment entrer en relation avec un utilisateur ?",
    answer: [
      "Si une demande vous intéresse, vous pouvez proposer votre accompagnement, en envoyant un devis.",
      "Si l'utilisateur souhaite poursuivre avec vous, la mise en relation est facilitée via la plateforme pour un premier échange.",
    ],
  },
  {
    question: "Comment se déroule la relation avec l'utilisateur ?",
    answer: [
      "Une fois la mise en relation effectuée, la relation se poursuit directement entre vous et votre client, selon vos modalités habituelles (rendez-vous, honoraires, suivi du dossier), hors de la plateforme.",
      "Gisèle n'intervient pas dans la gestion de la relation ni dans le traitement juridique.",
    ],
  },
  {
    question: "Puis-je choisir les types de dossiers que je reçois ?",
    answer: [
      "Oui. Vous définissez vos domaines d'intervention et, le cas échéant, votre zone géographique, afin de recevoir des demandes en adéquation avec votre activité.",
    ],
  },
  {
    question: "Comment mon profil est-il vérifié ?",
    answer: [
      "Lors de votre inscription, une vérification de votre qualité d'avocat est effectuée à partir des informations fournies (notamment votre inscription au barreau et votre carte professionnelle d'avocat).",
      "Cela garantit un accès réservé aux professionnels habilités.",
    ],
  },
  {
    question: "Quel est le modèle économique ?",
    answer: [
      "L'accès à la plateforme repose sur un abonnement, dont les modalités sont détaillées sur la page dédiée.",
      "Ce modèle vous permet d'accéder aux demandes et de choisir librement celles auxquelles vous souhaitez répondre.",
    ],
  },
  {
    question: "Gisèle fournit-elle du conseil juridique aux utilisateurs ?",
    answer: [
      "Non. Gisèle propose une synthèse d'informations juridiques générales et des démarches possibles à partir des réponses fournies par l'utilisateur.",
      "Elle ne délivre pas de conseil juridique personnalisé, qui relève exclusivement de votre intervention.",
    ],
  },
  {
    question: "Les utilisateurs sont-ils engagés lorsqu'ils font une demande ?",
    answer: [
      "Non. Les utilisateurs restent libres de donner suite ou non après une première prise de contact.",
      "L'objectif est de faciliter une mise en relation pertinente, sans engagement préalable.",
    ],
  },
  {
    question: "Puis-je arrêter à tout moment ?",
    answer: ["Oui, les modalités de résiliation sont précisées dans les conditions d'abonnement."],
  },
];

export const LAWYER_FAQ_SUBSCRIPTIONS: FaqItem[] = [
  {
    question: "Comment fonctionne l'offre gratuite ?",
    answer: ["L'inscription est gratuite et vous permet de :"],
    bullets: [
      "créer votre profil",
      "définir vos domaines d'intervention",
      "recevoir des demandes ciblées",
    ],
  },
  {
    question: "Suis-je libre de choisir les demandes auxquelles je réponds ?",
    answer: [
      "Oui. Quelle que soit la formule choisie, vous restez libre de sélectionner les demandes pertinentes pour votre activité.",
    ],
  },
  {
    question: "Existe-t-il une offre pour les cabinets ?",
    answer: [
      "Oui. Une offre « Cabinet » permet à plusieurs avocats d'un même cabinet d'accéder à Gisèle via un abonnement commun.",
    ],
  },
  {
    question: "Comment fonctionne l'offre Cabinet ?",
    answer: [
      "L'abonnement inclut plusieurs utilisateurs.",
      "Les demandes peuvent être consultées et traitées par les membres du cabinet, en fonction de leurs domaines d'intervention.",
    ],
  },
  {
    question: "Quand suis-je facturé ?",
    answer: ["Cela dépend de l'offre choisie :"],
    bullets: [
      "Découverte : vous payez uniquement lorsque vous proposez votre accompagnement sur une demande",
      "Essentiel : un abonnement mensuel inclut un nombre de réponses, puis paiement à l'unité au-delà",
      "Pro / Cabinet : abonnement mensuel avec réponses illimitées",
    ],
  },
  {
    question: "Puis-je changer d'offre ?",
    answer: [
      "Oui. Vous pouvez adapter votre abonnement à tout moment en fonction de votre activité et du volume de demandes souhaité.",
    ],
  },
  {
    question: "Comment fonctionnent les réponses aux demandes ?",
    answer: [
      "Répondre à une demande consiste à proposer votre accompagnement à un utilisateur.",
      "Chaque demande est adressée à plusieurs avocats : vous êtes libre de choisir celles auxquelles vous répondez. La réactivité est clé.",
    ],
  },
  {
    question: "Que se passe-t-il après ma réponse ?",
    answer: [
      "Si l'utilisateur est intéressé, la mise en relation se fait via la plateforme pour un premier échange.",
      "La suite (rendez-vous, honoraires, traitement du dossier) se fait directement entre vous et votre client.",
    ],
  },
  {
    question: "Puis-je dépasser le nombre de réponses incluses dans l'offre Essentiel ?",
    answer: [
      "Oui. Une fois votre quota mensuel atteint, vous pouvez continuer à répondre aux demandes en payant à l'unité.",
    ],
  },
  {
    question: "Quelle est la différence entre Essentiel et Pro ?",
    answer: [],
    bullets: [
      "Essentiel : nombre de réponses limité chaque mois, avec possibilité de compléter à l'unité",
      "Pro : réponses illimitées + mise en avant prioritaire",
    ],
  },
  {
    question: "Les demandes sont-elles garanties ?",
    answer: [
      "Non. Le volume de demandes peut varier selon votre domaine d'expertise, votre zone géographique et la période.",
    ],
  },
  {
    question: "Gisèle intervient-elle dans la gestion des dossiers ?",
    answer: [
      "Non. Gisèle facilite la mise en relation, mais n'intervient pas dans la suite de la relation ni dans le traitement juridique des dossiers.",
    ],
  },
];
