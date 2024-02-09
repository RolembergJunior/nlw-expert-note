import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import CardNotes from "./components/CardNotes/CardNotes";
import NewCardNote from "./components/NewCardNote/NewCardNote";
import { toast } from "sonner";

interface NotesProps {
  id: string;
  content: string;
  date: Date;
}

export default function App() {
  const [ scearch, setScearch ] = useState('');
  const [notes, setNotes] = useState<NotesProps[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');
    
    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }
    return []
});

  function onNoteCreated(content:string){
    const newNote= {
      id: crypto.randomUUID(),
      content,
      date: new Date()
    }

    const notesArray = [newNote, ...notes];
    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray)); 
  }

  function handleScearch(e:ChangeEvent<HTMLInputElement>){
    const query = e.target.value;

    setScearch(query)
    
  }

  const filteredNotes = scearch != '' ? notes.filter( note => note.content.toLowerCase().includes(scearch.toLowerCase())) : notes 

  function deleteNotes(id:string){
    const newArrayNotes = notes.filter( note => note.id != id );

    setNotes(newArrayNotes);
    toast.success('A nota foi exlcuida com sucesso')
    localStorage.setItem('notes', JSON.stringify(newArrayNotes));
  }


  return (
    <div className="max-w-6xl mx-auto my-12 space-y-6">
      <img src={logo} alt="Logo NLW-EXPERT" />
      <form action="">
        <input
        onChange={(e) => handleScearch(e)}
          className="bg-transparent text-3xl mt-6"
          type="text"
          placeholder="Busque em suas notas..."
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        <NewCardNote onNoteCreated={onNoteCreated} />
        { filteredNotes.map( note =>(
          <CardNotes key={note.id} deleteNotes={deleteNotes}  note={note} />
        ) ) }
      </div>
    </div>
  );
}
