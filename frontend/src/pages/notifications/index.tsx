import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useEffect, useState } from 'react';
import {
  fetchNotifications,
  setNotifications,
} from '../../redux/actions/notifications';
import PageLoader from '../../components/page-loader';
import { RootState } from '../../redux/reducers';
import NoDataFound from '../../components/no-data-found';
import { BsTrash } from 'react-icons/bs';

import parse from 'html-react-parser';
import { INotification } from '../../types/notifications';
import AlertConfirmation from '../../components/alert-confirmation';
import { errorHandler, toastMessage } from '../../utils/toast';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/constants';
import { setAuthHeaders } from '../../utils/helpers';

function boldText(message: string) {
  // Define the pattern to match the text to replace
  var pattern = /\*\*(.*?)\*\*/g;

  // Replace the text with the bold HTML tags
  var outputString = message.replace(pattern, '<b>$1</b>');

  return outputString;
}

function Notifications() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { notifications, isLoading } = useSelector(
    (state: RootState) => state.notificationsReducer,
  );

  const [selectedNotification, setSelectedNotification] = useState<
    INotification | undefined
  >(undefined);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteHandler = async () => {
    try {
      await axios.delete(
        BACKEND_URL + '/notifications/' + selectedNotification?._id,
        setAuthHeaders(user?.token as string),
      );
      toastMessage('success', 'Notification deleted!');
      dispatch(
        setNotifications(
          notifications.filter(
            (notification) => notification._id !== selectedNotification?._id,
          ),
        ),
      );
      setSelectedNotification(undefined);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios.get(
        BACKEND_URL + '/notifications/read',
        setAuthHeaders(user?.token as string),
      );
    } catch (error) {}
    dispatch(fetchNotifications());
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Notifications" />
      <PageLoader open={isLoading || isDeleting} />
      <AlertConfirmation
        callback={deleteHandler}
        description="This notification is going to be deleted and there is no going back."
        setShowAlert={setShowAlert}
        showAlert={showAlert}
      />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {notifications.map((notification, position) => (
          <div
            key={position}
            className="flex items-start justify-between gap-4 border-b border-b-indigo-50 p-5"
          >
            <div>
              <p className="font-bold text-lg">{notification.title}</p>
              <p className="text-sm">
                {parse(
                  boldText(notification.content.replaceAll('\n', '<br />')),
                )}
              </p>
            </div>
            <div>
              <button
                className="hover:text-danger hover:cursor-pointer"
                onClick={() => {
                  setSelectedNotification(notification);
                  setShowAlert(true);
                }}
              >
                <BsTrash />
              </button>
            </div>
          </div>
        ))}
        <NoDataFound data={notifications} />
      </div>
    </DefaultLayout>
  );
}

export default Notifications;
