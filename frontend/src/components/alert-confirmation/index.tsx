interface IProps {
  showAlert: boolean;
  setShowAlert: any;
  description: string;
  callback: any;
}

function AlertConfirmation(props: IProps) {
  return (
    <div
      className={`modal-container fixed z-50 ${
        props.showAlert ? 'flex' : 'hidden'
      } justify-center items-center inset-0 backdrop-blur-sm bg-strokedark/50`}
    >
      <div className="modal rounded-md max-w-[80%] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-auto">
        <div className="border-b border-stroke p-4 pr-6 dark:border-strokedark">
          <div className="w-full flex justify-between gap-2">
            <h2 className="text-lg font-bold">Are you still sure?</h2>
            <strong
              className="text-xl align-center cursor-pointer"
              onClick={() => props.setShowAlert(false)}
            >
              &times;
            </strong>
          </div>
        </div>
        <div className="p-4">
          <p className="text-md mb-4">{props.description}</p>
          <div className="flex justify-end gap-4">
            <button
              className="rounded-lg border border-black py-2 px-10 text-center font-medium text-black hover:bg-opacity-90"
              onClick={() => props.setShowAlert(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90"
              onClick={() => {
                props.setShowAlert(false);
                props.callback();
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertConfirmation;
