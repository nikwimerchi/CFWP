import { IChat } from '../../../../types/chat';
import parse from 'html-react-parser';

interface IProps {
  chat: IChat;
}

function boldText(message: string) {
  // Define the pattern to match the text to replace
  var pattern = /\*\*(.*?)\*\*/g;

  // Replace the text with the bold HTML tags
  var outputString = message.replace(pattern, '<b>$1</b>');

  return outputString;
}

function Message(props: IProps) {
  return (
    <div className="mb-3">
      {props.chat.role === 'assistant' ? (
        <div>
          <div className="bg-slate-300 p-3 inline-block max-w-[80%] rounded-3xl rounded-bl-[0] text-sm text-black-2">
            {parse(boldText(props.chat.content.replaceAll('\n', '<br />')))}
          </div>
        </div>
      ) : (
        <div className="flex items-end justify-end">
          <div className="bg-blue-600 p-3 inline-block max-w-[80%] rounded-3xl rounded-br-[0] text-sm text-white">
            {props.chat.content}
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;
