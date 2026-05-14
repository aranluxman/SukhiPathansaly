'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BookIcon, CheckIcon, EditIcon, PlusIcon } from '@/components/Icons';
import {
  FrenchPracticeEntry,
  STORAGE_KEYS,
  addToCollection,
  createId,
  formatDisplayDate,
  getCollection,
  todayInputValue
} from '@/lib/storage';

const words = [
  { french: 'maison', english: 'house', pronunciation: 'meh-zon', sentence: "J'habite dans une maison.", sentenceMeaning: 'I live in a house.' },
  { french: 'livre', english: 'book', pronunciation: 'leev-ruh', sentence: 'Je lis un livre.', sentenceMeaning: 'I am reading a book.' },
  { french: 'école', english: 'school', pronunciation: 'ay-kol', sentence: "L'école est près de la maison.", sentenceMeaning: 'The school is near the house.' },
  { french: 'autobus', english: 'bus', pronunciation: 'oh-toh-boos', sentence: "Je prends l'autobus.", sentenceMeaning: 'I take the bus.' },
  { french: 'fenêtre', english: 'window', pronunciation: 'fuh-net-ruh', sentence: 'La fenêtre est ouverte.', sentenceMeaning: 'The window is open.' },
  { french: 'chaise', english: 'chair', pronunciation: 'shehz', sentence: 'La chaise est confortable.', sentenceMeaning: 'The chair is comfortable.' },
  { french: 'porte', english: 'door', pronunciation: 'port', sentence: 'La porte est fermée.', sentenceMeaning: 'The door is closed.' },
  { french: 'avion', english: 'airplane', pronunciation: 'ah-vyohn', sentence: "L'avion arrive demain.", sentenceMeaning: 'The airplane arrives tomorrow.' },
  { french: 'ami', english: 'friend', pronunciation: 'ah-mee', sentence: "Mon ami est gentil.", sentenceMeaning: 'My friend is kind.' },
  { french: 'eau', english: 'water', pronunciation: 'oh', sentence: "Je bois de l'eau.", sentenceMeaning: 'I drink water.' },
  { french: 'pain', english: 'bread', pronunciation: 'pan', sentence: 'Le pain est chaud.', sentenceMeaning: 'The bread is warm.' },
  { french: 'lait', english: 'milk', pronunciation: 'leh', sentence: 'Je bois du lait le matin.', sentenceMeaning: 'I drink milk in the morning.' },
  { french: 'voiture', english: 'car', pronunciation: 'vwah-tyoor', sentence: 'La voiture est rouge.', sentenceMeaning: 'The car is red.' },
  { french: 'jardin', english: 'garden', pronunciation: 'zhar-dan', sentence: 'Le jardin est beau.', sentenceMeaning: 'The garden is beautiful.' },
  { french: 'fleur', english: 'flower', pronunciation: 'flur', sentence: 'La fleur sent bon.', sentenceMeaning: 'The flower smells good.' },
  { french: 'soleil', english: 'sun', pronunciation: 'so-lay', sentence: 'Le soleil brille aujourd\'hui.', sentenceMeaning: 'The sun shines today.' },
  { french: 'lune', english: 'moon', pronunciation: 'lyoon', sentence: 'La lune est pleine ce soir.', sentenceMeaning: 'The moon is full tonight.' },
  { french: 'étoile', english: 'star', pronunciation: 'ay-twahl', sentence: 'Je vois une étoile dans le ciel.', sentenceMeaning: 'I see a star in the sky.' },
  { french: 'mer', english: 'sea', pronunciation: 'mehr', sentence: 'La mer est calme aujourd\'hui.', sentenceMeaning: 'The sea is calm today.' },
  { french: 'montagne', english: 'mountain', pronunciation: 'mon-tan-yuh', sentence: 'La montagne est haute.', sentenceMeaning: 'The mountain is tall.' },
  { french: 'arbre', english: 'tree', pronunciation: 'ar-bruh', sentence: "L'arbre est grand.", sentenceMeaning: 'The tree is tall.' },
  { french: 'oiseau', english: 'bird', pronunciation: 'wah-zoh', sentence: "L'oiseau chante bien.", sentenceMeaning: 'The bird sings beautifully.' },
  { french: 'chat', english: 'cat', pronunciation: 'shah', sentence: 'Le chat dort sur le canapé.', sentenceMeaning: 'The cat sleeps on the sofa.' },
  { french: 'chien', english: 'dog', pronunciation: 'shyan', sentence: 'Mon chien est fidèle.', sentenceMeaning: 'My dog is loyal.' },
  { french: 'famille', english: 'family', pronunciation: 'fah-mee-yuh', sentence: "J'aime ma famille.", sentenceMeaning: 'I love my family.' },
  { french: 'enfant', english: 'child', pronunciation: 'ahn-fahn', sentence: "L'enfant rit beaucoup.", sentenceMeaning: 'The child laughs a lot.' },
  { french: 'mère', english: 'mother', pronunciation: 'mehr', sentence: 'Ma mère est gentille.', sentenceMeaning: 'My mother is kind.' },
  { french: 'père', english: 'father', pronunciation: 'pehr', sentence: 'Mon père travaille beaucoup.', sentenceMeaning: 'My father works a lot.' },
  { french: 'sœur', english: 'sister', pronunciation: 'sur', sentence: 'Ma sœur est drôle.', sentenceMeaning: 'My sister is funny.' },
  { french: 'frère', english: 'brother', pronunciation: 'frehr', sentence: 'Mon frère joue au football.', sentenceMeaning: 'My brother plays football.' },
  { french: 'grand-mère', english: 'grandmother', pronunciation: 'grahn-mehr', sentence: 'Ma grand-mère fait de bons gâteaux.', sentenceMeaning: 'My grandmother makes good cakes.' },
  { french: 'grand-père', english: 'grandfather', pronunciation: 'grahn-pehr', sentence: 'Mon grand-père raconte des histoires.', sentenceMeaning: 'My grandfather tells stories.' },
  { french: 'cuisine', english: 'kitchen', pronunciation: 'kwee-zeen', sentence: 'La cuisine sent bon.', sentenceMeaning: 'The kitchen smells good.' },
  { french: 'chambre', english: 'bedroom', pronunciation: 'shahm-bruh', sentence: 'Ma chambre est propre.', sentenceMeaning: 'My bedroom is clean.' },
  { french: 'salon', english: 'living room', pronunciation: 'sah-lon', sentence: 'Nous regardons la télé dans le salon.', sentenceMeaning: 'We watch TV in the living room.' },
  { french: 'table', english: 'table', pronunciation: 'tah-bluh', sentence: 'La table est ronde.', sentenceMeaning: 'The table is round.' },
  { french: 'lit', english: 'bed', pronunciation: 'lee', sentence: 'Le lit est confortable.', sentenceMeaning: 'The bed is comfortable.' },
  { french: 'rue', english: 'street', pronunciation: 'ryoo', sentence: 'La rue est longue.', sentenceMeaning: 'The street is long.' },
  { french: 'ville', english: 'city', pronunciation: 'veel', sentence: 'La ville est grande.', sentenceMeaning: 'The city is big.' },
  { french: 'pays', english: 'country', pronunciation: 'pay-ee', sentence: 'Mon pays est beau.', sentenceMeaning: 'My country is beautiful.' },
  { french: 'temps', english: 'weather / time', pronunciation: 'tahn', sentence: 'Le temps est beau.', sentenceMeaning: 'The weather is nice.' },
  { french: 'jour', english: 'day', pronunciation: 'zhoor', sentence: 'Bonne journée!', sentenceMeaning: 'Have a good day!' },
  { french: 'nuit', english: 'night', pronunciation: 'nwee', sentence: 'La nuit est tranquille.', sentenceMeaning: 'The night is quiet.' },
  { french: 'matin', english: 'morning', pronunciation: 'mah-tan', sentence: 'Je me lève le matin tôt.', sentenceMeaning: 'I wake up early in the morning.' },
  { french: 'soir', english: 'evening', pronunciation: 'swahr', sentence: 'Je me repose le soir.', sentenceMeaning: 'I rest in the evening.' },
  { french: 'semaine', english: 'week', pronunciation: 'suh-mehn', sentence: 'La semaine passe vite.', sentenceMeaning: 'The week goes by fast.' },
  { french: 'mois', english: 'month', pronunciation: 'mwah', sentence: 'Ce mois est beau.', sentenceMeaning: 'This month is lovely.' },
  { french: 'année', english: 'year', pronunciation: 'ah-nay', sentence: 'Bonne année!', sentenceMeaning: 'Happy New Year!' },
  { french: 'nourriture', english: 'food', pronunciation: 'noo-ree-tyoor', sentence: "La nourriture est délicieuse.", sentenceMeaning: 'The food is delicious.' },
  { french: 'musique', english: 'music', pronunciation: 'myoo-zeek', sentence: "J'écoute de la musique.", sentenceMeaning: 'I listen to music.' },
  { french: 'couleur', english: 'colour', pronunciation: 'koo-lur', sentence: 'Quelle est ta couleur préférée?', sentenceMeaning: 'What is your favourite colour?' }
];

const verbs = [
  {
    infinitive: 'manger',
    meaning: 'to eat',
    pronunciation: 'mahn-zhay',
    present: ['je mange', 'tu manges', 'il/elle mange', 'nous mangeons', 'vous mangez', 'ils/elles mangent'],
    passe: ["j'ai mangé", 'tu as mangé', 'il/elle a mangé', 'nous avons mangé', 'vous avez mangé', 'ils/elles ont mangé'],
    future: ['je mangerai', 'tu mangeras', 'il/elle mangera', 'nous mangerons', 'vous mangerez', 'ils/elles mangeront']
  },
  {
    infinitive: 'marcher',
    meaning: 'to walk',
    pronunciation: 'mar-shay',
    present: ['je marche', 'tu marches', 'il/elle marche', 'nous marchons', 'vous marchez', 'ils/elles marchent'],
    passe: ["j'ai marché", 'tu as marché', 'il/elle a marché', 'nous avons marché', 'vous avez marché', 'ils/elles ont marché'],
    future: ['je marcherai', 'tu marcheras', 'il/elle marchera', 'nous marcherons', 'vous marcherez', 'ils/elles marcheront']
  },
  {
    infinitive: 'parler',
    meaning: 'to speak',
    pronunciation: 'par-lay',
    present: ['je parle', 'tu parles', 'il/elle parle', 'nous parlons', 'vous parlez', 'ils/elles parlent'],
    passe: ["j'ai parlé", 'tu as parlé', 'il/elle a parlé', 'nous avons parlé', 'vous avez parlé', 'ils/elles ont parlé'],
    future: ['je parlerai', 'tu parleras', 'il/elle parlera', 'nous parlerons', 'vous parlerez', 'ils/elles parleront']
  },
  {
    infinitive: 'avoir',
    meaning: 'to have',
    pronunciation: 'ah-vwahr',
    present: ["j'ai", 'tu as', 'il/elle a', 'nous avons', 'vous avez', 'ils/elles ont'],
    passe: ["j'ai eu", 'tu as eu', 'il/elle a eu', 'nous avons eu', 'vous avez eu', 'ils/elles ont eu'],
    future: ["j'aurai", 'tu auras', 'il/elle aura', 'nous aurons', 'vous aurez', 'ils/elles auront']
  },
  {
    infinitive: 'être',
    meaning: 'to be',
    pronunciation: 'et-ruh',
    present: ['je suis', 'tu es', 'il/elle est', 'nous sommes', 'vous êtes', 'ils/elles sont'],
    passe: ["j'ai été", 'tu as été', 'il/elle a été', 'nous avons été', 'vous avez été', 'ils/elles ont été'],
    future: ['je serai', 'tu seras', 'il/elle sera', 'nous serons', 'vous serez', 'ils/elles seront']
  },
  {
    infinitive: 'aller',
    meaning: 'to go',
    pronunciation: 'ah-lay',
    present: ['je vais', 'tu vas', 'il/elle va', 'nous allons', 'vous allez', 'ils/elles vont'],
    passe: ['je suis allé(e)', 'tu es allé(e)', 'il/elle est allé(e)', 'nous sommes allé(e)s', 'vous êtes allé(e)s', 'ils/elles sont allé(e)s'],
    future: ["j'irai", 'tu iras', 'il/elle ira', 'nous irons', 'vous irez', 'ils/elles iront']
  },
  {
    infinitive: 'faire',
    meaning: 'to do / to make',
    pronunciation: 'fehr',
    present: ['je fais', 'tu fais', 'il/elle fait', 'nous faisons', 'vous faites', 'ils/elles font'],
    passe: ["j'ai fait", 'tu as fait', 'il/elle a fait', 'nous avons fait', 'vous avez fait', 'ils/elles ont fait'],
    future: ['je ferai', 'tu feras', 'il/elle fera', 'nous ferons', 'vous ferez', 'ils/elles feront']
  },
  {
    infinitive: 'venir',
    meaning: 'to come',
    pronunciation: 'vuh-neer',
    present: ['je viens', 'tu viens', 'il/elle vient', 'nous venons', 'vous venez', 'ils/elles viennent'],
    passe: ['je suis venu(e)', 'tu es venu(e)', 'il/elle est venu(e)', 'nous sommes venu(e)s', 'vous êtes venu(e)s', 'ils/elles sont venu(e)s'],
    future: ['je viendrai', 'tu viendras', 'il/elle viendra', 'nous viendrons', 'vous viendrez', 'ils/elles viendront']
  },
  {
    infinitive: 'dormir',
    meaning: 'to sleep',
    pronunciation: 'dor-meer',
    present: ['je dors', 'tu dors', 'il/elle dort', 'nous dormons', 'vous dormez', 'ils/elles dorment'],
    passe: ["j'ai dormi", 'tu as dormi', 'il/elle a dormi', 'nous avons dormi', 'vous avez dormi', 'ils/elles ont dormi'],
    future: ['je dormirai', 'tu dormiras', 'il/elle dormira', 'nous dormirons', 'vous dormirez', 'ils/elles dormiront']
  },
  {
    infinitive: 'lire',
    meaning: 'to read',
    pronunciation: 'leer',
    present: ['je lis', 'tu lis', 'il/elle lit', 'nous lisons', 'vous lisez', 'ils/elles lisent'],
    passe: ["j'ai lu", 'tu as lu', 'il/elle a lu', 'nous avons lu', 'vous avez lu', 'ils/elles ont lu'],
    future: ['je lirai', 'tu liras', 'il/elle lira', 'nous lirons', 'vous lirez', 'ils/elles liront']
  }
];

const pronouns = [
  ['je', 'I'],
  ['tu', 'you, informal'],
  ['il / elle', 'he / she'],
  ['nous', 'we'],
  ['vous', 'you, formal or plural'],
  ['ils / elles', 'they']
];

function dayIndex(length: number) {
  const today = new Date();
  const yearStart = Date.UTC(today.getFullYear(), 0, 1);
  const dayStart = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.floor((dayStart - yearStart) / 86_400_000) % length;
}

export default function FrenchStudyPage() {
  const [wordIndex, setWordIndex] = useState(() => dayIndex(words.length));
  const [verbIndex, setVerbIndex] = useState(() => dayIndex(verbs.length));
  const [wordHintOpen, setWordHintOpen] = useState(false);
  const [challengeHintOpen, setChallengeHintOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [entries, setEntries] = useState<FrenchPracticeEntry[]>([]);
  const today = todayInputValue();

  const word = words[wordIndex];
  const verb = verbs[verbIndex];
  const recentEntries = useMemo(() => entries.slice(0, 3), [entries]);

  useEffect(() => {
    setEntries(getCollection<FrenchPracticeEntry>(STORAGE_KEYS.frenchPractice));
  }, []);

  function tryAnotherWord() {
    setWordIndex((current) => (current + 1) % words.length);
    setWordHintOpen(false);
    setSavedMessage('');
  }

  function practiceAgain() {
    setVerbIndex((current) => (current + 1) % verbs.length);
    setChallengeHintOpen(false);
    setAnswer('');
    setSavedMessage('');
  }

  function savePractice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!answer.trim()) {
      setSavedMessage('Write one short sentence before saving.');
      return;
    }

    const entry: FrenchPracticeEntry = {
      id: createId(),
      date: today,
      word: word.french,
      verb: verb.infinitive,
      answer: answer.trim(),
      createdAt: new Date().toISOString()
    };

    setEntries(addToCollection<FrenchPracticeEntry>(STORAGE_KEYS.frenchPractice, entry));
    setAnswer('');
    setSavedMessage('Saved. A little practice counts.');
  }

  return (
    <div className="page-shell">
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="soft-label text-luxury-gold-light">French practice</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-luxury-text">French Study Dashboard</h1>
          <p className="mt-3 max-w-2xl text-luxury-muted">
            Build confidence with a small word, a useful verb, and one simple practice sentence each day. {words.length} words to explore — a new one every day.
          </p>
        </div>

        <aside className="section-card section-card-hover">
          <p className="soft-label text-luxury-gold-light">Today&apos;s study plan</p>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-luxury-muted">
            {['Learn the word of the day', 'Read the example sentence', 'Conjugate the verb in 3 tenses', 'Write your own sentence'].map(
              (task) => (
                <span className="inline-flex items-center gap-2" key={task}>
                  <CheckIcon className="h-4 w-4 text-luxury-gold-light" />
                  {task}
                </span>
              )
            )}
          </div>
        </aside>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1fr_1.15fr]">
        <div className="grid content-start gap-6">
          <article className="section-card section-card-hover">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="soft-label">Word of the day</p>
                <h2 className="mt-3 font-serif text-5xl font-bold text-luxury-text">{word.french}</h2>
                <p className="mt-2 text-sm font-semibold text-luxury-muted">Say it: {word.pronunciation}</p>
              </div>
              <BookIcon className="h-8 w-8 shrink-0 text-luxury-gold-light" />
            </div>

            <div className="rounded-lg border border-luxury-line bg-black/25 p-4">
              <p className="soft-label">Daily challenge</p>
              <p className="mt-2 leading-7 text-luxury-text">Use this word in your own sentence.</p>
            </div>

            {wordHintOpen ? (
              <div className="mt-4 rounded-lg border border-luxury-line bg-luxury-gold/10 p-4">
                <p className="font-bold text-luxury-gold-light">{word.english}</p>
                <p className="mt-2 text-sm leading-6 text-luxury-muted">Pronunciation: {word.pronunciation}</p>
                <p className="mt-2 text-sm leading-6 text-luxury-text">
                  {word.sentence} <span className="text-luxury-muted">({word.sentenceMeaning})</span>
                </p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="secondary-button" onClick={() => setWordHintOpen((value) => !value)} type="button">
                {wordHintOpen ? 'Hide Hint' : 'Show Hint'}
              </button>
              <button className="secondary-button" onClick={tryAnotherWord} type="button">
                Try Another Word
              </button>
            </div>
          </article>

          <article className="section-card">
            <p className="soft-label">How to conjugate</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-luxury-text">A simple beginner guide</h2>
            <p className="mt-3 leading-7 text-luxury-muted">
              French verbs change depending on who is doing the action and when it happens. Start by matching the subject
              pronoun, then notice the ending.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {pronouns.map(([pronoun, meaning]) => (
                <div className="rounded-lg border border-luxury-line bg-black/25 p-3" key={pronoun}>
                  <p className="font-bold text-luxury-gold-light">{pronoun}</p>
                  <p className="mt-1 text-sm text-luxury-muted">{meaning}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-luxury-line bg-black/25 p-4 text-sm leading-6 text-luxury-muted">
              Present is for now. Passé composé is for something already done. Future simple is for something that will
              happen later.
            </div>
          </article>
        </div>

        <div className="grid content-start gap-6">
          <article className="section-card section-card-hover">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="soft-label">Verb of the day</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-luxury-text">
                  {verb.infinitive} <span className="text-xl text-luxury-muted">({verb.meaning})</span>
                </h2>
                <p className="mt-2 text-sm font-semibold text-luxury-muted">Say it: {verb.pronunciation}</p>
              </div>
              <button className="secondary-button" onClick={practiceAgain} type="button">
                Practice Again
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-luxury-line">
              {[
                ['Present', verb.present],
                ['Passé composé', verb.passe],
                ['Future simple', verb.future]
              ].map(([tense, forms]) => (
                <div className="border-b border-luxury-line last:border-b-0" key={tense as string}>
                  <div className="bg-luxury-gold/10 px-4 py-3 font-bold text-luxury-gold-light">{tense as string}</div>
                  <div className="grid gap-px bg-luxury-line sm:grid-cols-2">
                    {(forms as string[]).map((form) => (
                      <p className="bg-luxury-card px-4 py-3 text-sm font-semibold text-luxury-text" key={form}>
                        {form}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <section className="section-card">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-luxury-line bg-luxury-gold/10 text-luxury-gold-light">
                <EditIcon />
              </span>
              <div>
                <p className="soft-label">Daily challenge</p>
                <h2 className="font-serif text-xl font-bold text-luxury-text">Write one sentence</h2>
              </div>
            </div>

            <form className="grid gap-4" onSubmit={savePractice}>
              <div className="rounded-lg border border-luxury-line bg-black/25 p-4">
                <p className="text-sm leading-6 text-luxury-muted">
                  Try using <span className="font-bold text-luxury-gold-light">{word.french}</span> or{' '}
                  <span className="font-bold text-luxury-gold-light">{verb.infinitive}</span> in a short French sentence.
                </p>
              </div>

              {challengeHintOpen ? (
                <p className="rounded-lg border border-luxury-line bg-luxury-gold/10 p-4 text-sm leading-6 text-luxury-muted">
                  Hint: Start with a simple subject like <span className="font-bold text-luxury-gold-light">je</span> or{' '}
                  <span className="font-bold text-luxury-gold-light">nous</span>. You can model it after:{' '}
                  <span className="text-luxury-text">{word.sentence}</span>
                </p>
              ) : null}

              <label className="grid gap-2">
                <span className="soft-label">Your sentence</span>
                <textarea
                  className="form-field min-h-32 resize-y"
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Write a simple French sentence here..."
                  value={answer}
                />
              </label>

              {savedMessage ? (
                <p className="rounded-lg border border-luxury-line bg-black/25 px-4 py-3 text-sm font-semibold text-luxury-muted">
                  {savedMessage}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button className="primary-button" type="submit">
                  <PlusIcon className="h-5 w-5" />
                  Save Practice
                </button>
                <button className="secondary-button" onClick={() => setChallengeHintOpen((value) => !value)} type="button">
                  {challengeHintOpen ? 'Hide Challenge Hint' : 'Show Challenge Hint'}
                </button>
              </div>
            </form>
          </section>

          <section className="section-card">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-serif text-xl font-bold text-luxury-text">Recent practice</h2>
              <span className="gold-badge">{entries.length} saved</span>
            </div>

            <div className="grid gap-3">
              {recentEntries.length === 0 ? (
                <p className="rounded-lg border border-dashed border-luxury-line bg-black/20 p-5 text-sm leading-6 text-luxury-muted">
                  Saved French practice will appear here. One sentence a day is enough to build confidence.
                </p>
              ) : (
                recentEntries.map((entry) => (
                  <article className="rounded-lg border border-luxury-line bg-black/25 p-4" key={entry.id}>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-luxury-gold-light">
                      {formatDisplayDate(entry.date)} · {entry.word} · {entry.verb}
                    </p>
                    <p className="mt-3 whitespace-pre-line leading-7 text-luxury-text">{entry.answer}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
