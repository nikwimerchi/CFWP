import { ChangeEvent } from 'react';
import { BsSend } from 'react-icons/bs';

interface IProps {
  question: string;
  setQuestion: any;
  handleSubmit: any;
  isSubmitting: boolean;
}
function Input(props: IProps) {
  return (
    <div className="flex items-start justify-start gap-2">
      <textarea
        value={props.question}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          props.setQuestion(e.target.value)
        }
        disabled={props.isSubmitting}
        placeholder="Enter your question here...."
        className="w-full rounded-2xl border-[1.5px] border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary disabled:bg-zinc-300"
      />
      <button
        disabled={props.isSubmitting}
        className="bg-primary text-white p-4 rounded-full hover:cursor-pointer hover:bg-primary/80"
        onClick={() => props.handleSubmit()}
      >
        <BsSend size={20} />
      </button>
    </div>
  );
}

export default Input;
