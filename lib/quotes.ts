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
  'Health grows in the routines that feel kind enough to keep.'
];

export function getDailyQuote(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);

  return wellnessQuotes[dayOfYear % wellnessQuotes.length];
}
