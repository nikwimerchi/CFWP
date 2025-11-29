import { BsDownload } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { exportToExcel } from '../../utils/lib';
interface BreadcrumbProps {
  pageName: string;
  exportableData?: any;
}
const Breadcrumb = ({ pageName, exportableData }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      {exportableData ? (
        <button
          onClick={() => exportToExcel(exportableData)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 flex items-center gap-2 text-sm"
        >
          <BsDownload /> Export data
        </button>
      ) : (
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" to="/">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">{pageName}</li>
          </ol>
        </nav>
      )}
    </div>
  );
};

export default Breadcrumb;
