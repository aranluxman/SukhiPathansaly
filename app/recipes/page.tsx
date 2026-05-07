'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BookIcon, ChevronDownIcon, ExternalLinkIcon, PlusIcon, SearchIcon, TrashIcon } from '@/components/Icons';
import { Recipe, STORAGE_KEYS, addToCollection, createId, deleteFromCollection, getCollection } from '@/lib/storage';

const notebookUrl = 'https://notebooklm.google.com/notebook/7b4113c0-d161-4605-b4ec-3c8d7dad6521';

const initialForm = {
  title: '',
  ingredients: '',
  instructions: '',
  category: ''
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(initialForm);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setRecipes(getCollection<Recipe>(STORAGE_KEYS.recipes));
  }, []);

  const filteredRecipes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return recipes;
    }

    return recipes.filter((recipe) =>
      [recipe.title, recipe.category, recipe.ingredients, recipe.instructions]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }, [query, recipes]);

  function submitRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() || !form.ingredients.trim() || !form.instructions.trim()) {
      return;
    }

    const recipe: Recipe = {
      id: createId(),
      title: form.title.trim(),
      ingredients: form.ingredients.trim(),
      instructions: form.instructions.trim(),
      category: form.category.trim() || 'Family Favorite',
      createdAt: new Date().toISOString()
    };

    const nextRecipes = addToCollection<Recipe>(STORAGE_KEYS.recipes, recipe);
    setRecipes(nextRecipes);
    setExpandedId(recipe.id);
    setForm(initialForm);
  }

  function deleteRecipe(id: string) {
    setRecipes(deleteFromCollection<Recipe>(STORAGE_KEYS.recipes, id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  }

  return (
    <div className="page-shell">
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <p className="soft-label text-luxury-gold-light">Recipe finder</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-luxury-text">
            Search your personal recipe collection 🍽️
          </h1>
          <p className="mt-3 max-w-2xl text-luxury-muted">
            A refined home for her NotebookLM recipe book and any family recipes she wants to save by hand.
          </p>
        </div>

        <form className="flex gap-3" onSubmit={(event) => event.preventDefault()}>
          <label className="relative flex-1">
            <span className="sr-only">Search recipes</span>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-gold" />
            <input
              className="form-field pl-12"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ingredients or recipes"
              value={query}
            />
          </label>
          <button className="primary-button shrink-0" type="submit">
            Search
          </button>
        </form>
      </section>

      <section className="section-card section-card-hover mb-8 text-center">
        <BookIcon className="mx-auto h-12 w-12 text-luxury-gold-light" />
        <h2 className="mt-4 font-serif text-2xl font-bold text-luxury-text">Your recipes are stored in your personal NotebookLM notebook.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-luxury-muted">
          Open the notebook directly, then type any food or ingredient into the chat and it will find the recipe for you instantly.
        </p>
        <a className="primary-button mt-6 text-base" href={notebookUrl} rel="noreferrer" target="_blank">
          Open My Recipe Book 📖
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
        <p className="mt-5 text-sm font-semibold text-luxury-muted">
          Tip: Once inside, type any food or ingredient into the chat and it will find the recipe for you instantly!
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="section-card h-fit" onSubmit={submitRecipe}>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-luxury-line bg-luxury-gold/10 text-luxury-gold-light">
              <PlusIcon />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold text-luxury-text">Save a recipe</h2>
              <p className="text-sm text-luxury-muted">Keep favorite dishes nearby for next time.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="soft-label">Title</span>
              <input
                className="form-field"
                onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
                placeholder="Coconut curry"
                required
                value={form.title}
              />
            </label>
            <label className="grid gap-2">
              <span className="soft-label">Category</span>
              <input
                className="form-field"
                onChange={(event) => setForm((value) => ({ ...value, category: event.target.value }))}
                placeholder="Dinner, dessert, snack"
                value={form.category}
              />
            </label>
            <label className="grid gap-2">
              <span className="soft-label">Ingredients</span>
              <textarea
                className="form-field min-h-32 resize-y"
                onChange={(event) => setForm((value) => ({ ...value, ingredients: event.target.value }))}
                placeholder="List each ingredient on its own line."
                required
                value={form.ingredients}
              />
            </label>
            <label className="grid gap-2">
              <span className="soft-label">Instructions</span>
              <textarea
                className="form-field min-h-36 resize-y"
                onChange={(event) => setForm((value) => ({ ...value, instructions: event.target.value }))}
                placeholder="Write the steps here."
                required
                value={form.instructions}
              />
            </label>
            <button className="primary-button w-full" type="submit">
              <PlusIcon className="h-5 w-5" />
              Save Recipe
            </button>
          </div>
        </form>

        <div className="grid content-start gap-4">
          {filteredRecipes.length === 0 ? (
            <div className="section-card text-center">
              <BookIcon className="mx-auto h-10 w-10 text-luxury-gold" />
              <h2 className="mt-4 font-serif text-xl font-bold text-luxury-text">No saved recipes yet</h2>
              <p className="mt-2 text-sm text-luxury-muted">
                {recipes.length === 0 ? 'Manual recipes will appear here.' : 'No recipes match that search.'}
              </p>
            </div>
          ) : (
            filteredRecipes.map((recipe) => {
              const expanded = expandedId === recipe.id;

              return (
                <article className="section-card section-card-hover" key={recipe.id}>
                  <div className="flex items-start justify-between gap-4">
                    <button
                      className="flex flex-1 items-start justify-between gap-4 text-left"
                      onClick={() => setExpandedId(expanded ? null : recipe.id)}
                      type="button"
                    >
                      <span>
                        <span className="gold-badge">{recipe.category}</span>
                        <h3 className="mt-3 font-serif text-2xl font-bold text-luxury-text">{recipe.title}</h3>
                      </span>
                      <ChevronDownIcon
                        className={`mt-2 h-5 w-5 shrink-0 text-luxury-gold-light ${expanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <button
                      aria-label={`Delete ${recipe.title}`}
                      className="danger-button shrink-0"
                      onClick={() => deleteRecipe(recipe.id)}
                      type="button"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {expanded ? (
                    <div className="mt-5 grid gap-5 border-t border-luxury-line pt-5">
                      <div>
                        <p className="soft-label">Ingredients</p>
                        <p className="mt-2 whitespace-pre-line leading-7 text-luxury-muted">{recipe.ingredients}</p>
                      </div>
                      <div>
                        <p className="soft-label">Instructions</p>
                        <p className="mt-2 whitespace-pre-line leading-7 text-luxury-muted">{recipe.instructions}</p>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
