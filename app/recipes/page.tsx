import { ExternalLinkIcon } from '@/components/Icons';

const notebookUrl = 'https://notebooklm.google.com/notebook/7b4113c0-d161-4605-b4ec-3c8d7dad6521';

export default function RecipesPage() {
  return (
    <div className="page-shell">
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="soft-label text-blush-600">Recipe finder</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Search your personal recipe collection below 🍽️</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Your NotebookLM recipe notebook is embedded here so every favorite dish is close by.
          </p>
        </div>
        <a className="primary-button shrink-0" href={notebookUrl} rel="noreferrer" target="_blank">
          Open in NotebookLM ↗
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
        <iframe
          className="min-h-[700px] w-full"
          src={notebookUrl}
          title="Sukhi's NotebookLM recipe collection"
        />
      </section>

      <p className="mt-5 rounded-2xl bg-blush-50 px-5 py-4 text-sm font-semibold leading-6 text-slate-700">
        Tip: Type any food or ingredient and your notebook will find the recipe for you!
      </p>
    </div>
  );
}
