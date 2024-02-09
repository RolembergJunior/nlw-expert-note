import { ChangeEvent, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'sonner'; 

interface NewCardNoteProps{
  onNoteCreated: (content:string) => void;
}


const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

const speechRecognition = new SpeechRecognitionAPI();

export default function NewCardNote({ onNoteCreated }:NewCardNoteProps){
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [ isRecording, setIsRecording ] = useState(false);
  const [ textInputed, setTextInputed ] = useState('');

  function handleChangeTextInput(e:ChangeEvent<HTMLTextAreaElement>){
      setTextInputed(e.target.value)
  }

  function handleRecording(){
    setIsRecording(true);
    setShouldShowOnBoarding(false);

    const isSpeechRecognitionAPIAvaliable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionAPIAvaliable){
      alert('Infelizmente seu navegador não suporta a API de gravação!');
      return
    }

    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) =>{
        return text.concat(result[0].transcript)
      },'')

      setTextInputed(transcription);
    }

    speechRecognition.onerror = (event) => {
      console.error(event);
    }

    speechRecognition.start();

  }

  function handleStopRecording(){
    setIsRecording(false);

    if( speechRecognition !== null ){
      speechRecognition.stop()
    }
  }

  function onSaveNote(){
    if( textInputed != '' && !shouldShowOnBoarding){
      toast.success('Nota salva com sucesso');
      onNoteCreated(textInputed);
      
      setTextInputed('');
      setShouldShowOnBoarding(true);
    } else if( shouldShowOnBoarding ){
      toast.warning('Por favor, escolha a forma que quer adicionar a nota')
    }  else{
      toast.error('Por favor, digite alguma coisa')
    }
  }

    return(
      <Dialog.Root>
        <Dialog.Trigger className='relative bg-slate-700 w-87 h-full p-5 text-left rounded-md hover:ring-2 hover:ring-slate-600 focus:ring-2 focus:ring-lime-400 duration-75' >
            <span className='text-sm font-medium text-slate-300'>
              Adicionar nota
            </span>
            <p className='text-sm leading-6 text-slate-400'>
              Grave uma nota em áudio que será convertida para texto automaticamente.
            </p>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 bg-black/50 fixed" />
          <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>
            <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {shouldShowOnBoarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    onClick={() => handleRecording()}
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    type="button"
                    onClick={() => setShouldShowOnBoarding(false)}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={(e) => handleChangeTextInput(e)}
                  value={textInputed}
                />
              )}
            </div>
            { isRecording ? (
              <button
              onClick={() => handleStopRecording()}
              type="button"
              className="w-full flex items-center justify-center fap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
              >
                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
              type="button"
              onClick={() => onSaveNote()}
              className="bg-lime-400 w-full py-4 text-center text-sm text-slate-300 outline-none font-medium group"
              >
                <span className='text-black' >Salvar nota</span>  
              </button>
            )}
              
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
}