import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useParams } from 'react-router-dom';
import useFetchSingleChild from '../../../hooks/useFetchSingleChild';
import PageLoader from '../../../components/page-loader';
import Input from './input';
import { useEffect, useState } from 'react';
import { IChat } from '../../../types/chat';
import { errorHandler, toastMessage } from '../../../utils/toast';
import axios from 'axios';
import { BACKEND_URL } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';
import { setAuthHeaders } from '../../../utils/helpers';
import AILoader from './ai-loader';
import Message from './message';
const Chat = () => {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.user);
  const kid = useFetchSingleChild(id as string);

  const [chats, setChats] = useState<IChat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [question, setQuestion] = useState('');

  const handleSubmit = async () => {
    if (!kid.child) {
      toastMessage(
        'error',
        'There is nothing we can do right now. Kid not found!',
      );
      return;
    }

    if (question.trim().length === 0) {
      toastMessage('error', 'Please ask a question.');
      return;
    }

    try {
      setIsSubmitting(true);
      setChats((prev) => [
        ...prev,
        {
          childId: '',
          content: question,
          role: 'user',
          createdAt: '',
          updatedAt: '',
          userId: '',
        },
      ]);
      const res = await axios.post(
        BACKEND_URL + '/chat',
        {
          childId: kid.child._id,
          content: question,
        },
        setAuthHeaders(user?.token as string),
      );
      setChats((prev) => [...prev, res.data.chat]);
      setQuestion('');
    } catch (error) {
      errorHandler(error);
      setChats((prev) => prev.filter((item) => item.childId !== ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        BACKEND_URL + '/chat/' + kid.child?._id,
        setAuthHeaders(user?.token as string),
      );
      setChats(res.data.chats);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchChats();
  }, [kid.child]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Ask our AI" />
      {kid.child && (
        <p className="text-sm mb-2">
          Child Names: {kid.child.firstName} {kid.child.middleName}{' '}
          {kid.child.lastName}
        </p>
      )}
      <PageLoader open={kid.isLoading || (chats.length === 0 && isLoading)} />
      <div className="h-full min-h-[68vh] flex gap-2 flex-col">
        <div className="h-full flex-1 overflow-y-auto">
          {kid.child && (
            <Message
              chat={{
                childId: '',
                content:
                  'Let me Know which health advice or info do you want to get for ' +
                  kid.child?.firstName,
                role: 'assistant',
                createdAt: '',
                updatedAt: '',
                userId: '',
              }}
            />
          )}
          {chats.map((chat, index) => (
            <Message key={index} chat={chat} />
          ))}
          {isSubmitting && <AILoader />}
        </div>
        <Input
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          question={question}
          setQuestion={setQuestion}
        />
      </div>
    </DefaultLayout>
  );
};

export default Chat;
