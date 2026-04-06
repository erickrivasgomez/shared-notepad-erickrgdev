import NotebookList from '@/components/notebooks/NotebookList';

export default function NotebooksPage() {
  return (
    <div className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-900/50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold tracking-tight">Mis Libretas</h1>
        </div>
        
        <NotebookList />
      </div>
    </div>
  );
}
