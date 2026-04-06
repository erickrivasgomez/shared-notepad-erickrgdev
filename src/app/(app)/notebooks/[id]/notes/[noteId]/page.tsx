import NoteEditor from '@/components/notes/NoteEditor';

export default function NotePage({ params }: { params: { id: string; noteId: string } }) {
  return <NoteEditor noteId={params.noteId} />;
}
