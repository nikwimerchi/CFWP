import { IUser } from '../../../../types/user';
import { IChild } from '../../../../types/child';
import { calculateAge } from '../../../../utils/helpers';
import { Link } from 'react-router-dom';

interface IProps {
  showModal: boolean;
  setShowModal: any;
  allChildren: IChild[];
  selectedParent: IUser | undefined;
}

export const ParentChildrens = (props: IProps) => {
  return (
    <div
      className={`modal-container fixed z-999999 ${
        props.showModal ? 'flex' : 'hidden'
      } justify-center items-center inset-0 backdrop-blur-sm bg-strokedark/50`}
    >
      <div className="modal rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-auto  w-[80%] relative">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <div className="w-full flex justify-between">
            <h2 className="text-lg">
              {props.selectedParent?.names}'s Children
            </h2>
            <strong
              className="text-xl align-center cursor-pointer"
              onClick={() => props.setShowModal(false)}
            >
              &times;
            </strong>
          </div>
        </div>
        <div className="p-4 max-h-[80vh]">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4 text-sm">
                  <th className="p-2 font-bold text-black dark:text-white xl:pl-11">
                    No
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white xl:pl-11">
                    Names
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Date of birth
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Age
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Sex
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Registered At
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Status
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.selectedParent &&
                  props.allChildren
                    .filter(
                      (child) => child.parentId === props.selectedParent?._id,
                    )
                    .map((child, key) => (
                      <tr key={key}>
                        <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                          <h5 className="font-medium text-black dark:text-white capitalize">
                            {key + 1}
                          </h5>
                        </td>
                        <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                          <h5 className="font-medium text-black dark:text-white capitalize">
                            {`${child.firstName} ${child.lastName}`}
                          </h5>
                        </td>
                        <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {child.dateOfBirth}
                          </p>
                        </td>
                        <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {calculateAge(child.dateOfBirth)}
                          </p>
                        </td>
                        <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {child.sex}
                          </p>
                        </td>
                        <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {child.createdAt.split('T')[0]}
                          </p>
                        </td>
                        <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                          <p
                            className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium capitalize ${
                              child.status === 'approved'
                                ? 'bg-success text-success'
                                : child.status === 'rejected'
                                ? 'bg-danger text-danger'
                                : 'bg-warning text-warning'
                            }`}
                          >
                            {child.status}
                          </p>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <Link
                              to={'/children/edit/' + child._id}
                              className="bg-warning/80 text-white px-4 py-2 rounded hover:bg-primary/90"
                            >
                              Edit
                            </Link>
                            {child.status === 'approved' && (
                              <Link
                                to={'/children/' + child._id}
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                              >
                                Health Info
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
