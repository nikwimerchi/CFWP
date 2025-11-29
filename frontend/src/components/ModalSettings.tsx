import axios from 'axios';
import { BACKEND_URL } from '../utils/constants';
import { setAuthHeaders } from '../utils/helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { toastMessage } from '../utils/toast';

export const Modal = ({ closeModal, open, defaultValue, id, getChildren }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        BACKEND_URL + `/child/${id}`,
        setAuthHeaders(user?.token as string),
      );
      toastMessage('success', response.data.message);
      getChildren();
      // Close the modal after deletion
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`modal-container fixed z-50 ${
        open ? 'flex' : 'hidden'
      } justify-center items-center inset-0 backdrop-blur-sm bg-strokedark/50`}
    >
      <div className="modal rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-auto">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <div className="w-full flex justify-between">
            <h2 className="text-lg">Delete child</h2>
            <strong
              className="text-xl align-center cursor-pointer"
              onClick={closeModal}
            >
              &times;
            </strong>
          </div>
        </div>
        <div className="p-4">
          <h1 className="text-lg mb-4">{defaultValue}</h1>
          <div className="flex justify-end">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
