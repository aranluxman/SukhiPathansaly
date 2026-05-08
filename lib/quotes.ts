const wellnessQuotes = [
  'Small steps every day become the path to lasting strength.',
  'Your body hears everything your heart believes. Speak gently.',
  'Wellness is not a finish line. It is a kind conversation with yourself.',
  'Movement is a celebration of what you can do today.',
  'A nourishing meal is a little note of care to your future self.',
  'Rest is productive when it returns you to yourself.',
  'Progress blooms quietly, then all at once.',
  'Choose the habit that loves you back.',
  'You do not need a perfect day to make a beautiful choice.',
  'Health grows in the routines that feel kind enough to keep.',
  'A calm morning can become a steady day.',
  'One kind choice is still a powerful choice.',
  'The smallest ritual can become a source of strength.',
  'Breathe in patience, breathe out pressure.',
  'Let today be gentle and still count.',
  'A little consistency can carry a lot of love.',
  'Your pace is allowed to be peaceful.',
  'Care for yourself as someone deeply worth caring for.',
  'The good you notice gets easier to find.',
  'Energy returns when rest is treated with respect.',
  'A grateful heart makes ordinary moments shine.',
  'Strong days and soft days both belong.',
  'A healthy life is built from loving details.',
  'Today is a fresh chance to be on your own side.',
  'Joy can be simple and still be enough.',
  'Listen to your body with kindness first.',
  'Every nourishing choice is a quiet celebration.',
  'You are allowed to begin again as many times as you need.',
  'Peace is part of wellness too.',
  'Your future self is grateful for small care today.',
  'Notice the good, even if it was quiet.'
];

export function getDailyQuote(date = new Date()) {
  const dayStart = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const yearStart = Date.UTC(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((dayStart - yearStart) / 86_400_000);

  return wellnessQuotes[dayOfYear % wellnessQuotes.length];
}
