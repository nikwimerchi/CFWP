import { BsPaintBucket } from 'react-icons/bs';

interface IProps {
  data: any[];
}

function NoDataFound(props: IProps) {
  return (
    <>
      {props.data.length === 0 && (
        <div className="max-w-[30%] mx-auto p-5 border border-indigo-50 rounded-md">
          <div className="flex items-center justify-center flex-col gap-2">
            <BsPaintBucket size={40} className="text-red-400" />
            <p className="text-sm text-center">No data found</p>
          </div>
        </div>
      )}
    </>
  );
}

export default NoDataFound;
