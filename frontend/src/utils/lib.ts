import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface IObj {
  [key: string]: string | boolean | number;
}

export const convertObjetToQueryParams = (obj: IObj): string => {
  let query = '';
  const keys = Object.keys(obj);

  keys.map((key) => {
    if (obj[key] !== '')
      query =
        query === '' ? `?${key}=${obj[key]}` : query + `&${key}=${obj[key]}`;
  });
  return query;
};

export const exportToExcel = (data: any) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'export-data.xlsx');
};
