import { useState } from "react";
import { loadState, saveState } from "../../../../utils/storage";

export default function useJournal() {
  const [journalEntries, setJournalEntries] = useState(() => loadState('journal_entries', []));
  const [journalText, setJournalText] = useState("");

  const addEntry = () => {
    if (!journalText.trim()) return;
    const d = new Date();
    const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const updated = [{ date: dateStr, content: journalText.trim() }, ...journalEntries].slice(0, 20);
    setJournalEntries(updated);
    saveState('journal_entries', updated);
    setJournalText("");
  };

  return { journalEntries, journalText, setJournalText, addEntry };
}
