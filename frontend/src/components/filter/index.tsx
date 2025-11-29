import { ChangeEvent, useEffect, useState } from 'react';

//@ts-ignore
import { Provinces, Districts, Sectors, Villages, Cells } from 'rwanda';
import { cn } from '../../utils/lib';

interface IFilterItem {
  label: string;
  value: string;
}

interface IFilter {
  name: string;
  label: string;
  valueType?: 'string' | 'number' | 'boolean';
  options: IFilterItem[];
}

interface IProps {
  hasAddressFilter: boolean;
  columns?: number;
  setFilters: any;
  filters?: IFilter[];
}

const convertValue = (
  value: string,
  returnType: 'string' | 'number' | 'boolean',
): Boolean | String | Number => {
  if (returnType === 'boolean') return Boolean(value);
  if (returnType === 'number') return Number(value);

  return value;
};

const returnMDGridColumnClass = (columns: number): string => {
  if (columns === 1) return 'md:grid-cols-1';
  if (columns === 2) return 'md:grid-cols-2';
  if (columns === 3) return 'md:grid-cols-3';
  if (columns === 4) return 'md:grid-cols-4';
  if (columns === 5) return 'md:grid-cols-5';
  if (columns === 6) return 'md:grid-cols-6';
  if (columns === 7) return 'md:grid-cols-7';
  if (columns === 8) return 'md:grid-cols-8';
  if (columns === 9) return 'md:grid-cols-9';
  if (columns === 10) return 'md:grid-cols-10';

  return 'md:grid-cols-3';
};

function Filter(props: IProps) {
  const dynamicFilters: any = {};

  if (props.filters) {
    for (let i = 0; i < props.filters.length; i++) {
      const filterItem = props.filters[i];
      dynamicFilters[filterItem.name] = '';
    }
  }

  const initialState = props.hasAddressFilter
    ? {
        ...dynamicFilters,
        province: '',
        district: '',
        sector: '',
        cell: '',
        village: '',
      }
    : { ...dynamicFilters };

  const [state, setState] = useState<any>(initialState);

  const [provincesList, setProvincesList] = useState<string[]>([]);
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [sectorsList, setSectorsList] = useState<string[]>([]);
  const [cellsList, setCellsList] = useState<string[]>([]);
  const [villagesList, setVillagesList] = useState<string[]>([]);

  useEffect(() => {
    setProvincesList(Provinces());
  }, []);

  useEffect(() => {
    props.setFilters(state);
  }, [state]);

  return (
    <>
      {props.hasAddressFilter ? (
        <div
          className={cn([
            'grid grid-cols-2 gap-2',
            props.columns
              ? returnMDGridColumnClass(props.columns)
              : 'md:grid-cols-5',
          ])}
        >
          <select
            required
            value={state.province}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setState((prev: any) => ({
                ...prev,
                province: e.target.value,
              }));
              e.target.value === ''
                ? setDistrictsList([])
                : setDistrictsList(Districts(e.target.value));
            }}
            className="w-full rounded-lg border border-stroke bg-transparent p-2 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">All Province</option>
            {provincesList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* District dropdown */}
          <select
            required
            value={state.district}
            onChange={(e) => {
              setState((prev: any) => ({
                ...prev,
                district: e.target.value,
              }));
              e.target.value === ''
                ? setSectorsList([])
                : setSectorsList(Sectors(state.province, e.target.value));
            }}
            className="w-full rounded-lg border border-stroke bg-transparent p-2 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">All Districts</option>
            {districtsList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Sector dropdown */}
          <select
            required
            value={state.sector}
            onChange={(e) => {
              setState((prev: any) => ({
                ...prev,
                sector: e.target.value,
              }));
              e.target.value === ''
                ? setCellsList([])
                : setCellsList(
                    Cells(state.province, state.district, e.target.value),
                  );
            }}
            className="w-full rounded-lg border border-stroke bg-transparent p-2 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">All Sectors</option>
            {sectorsList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Cell dropdown */}
          <select
            required
            value={state.cell}
            onChange={(e) => {
              setState((prev: any) => ({
                ...prev,
                cell: e.target.value,
              }));
              e.target.value === ''
                ? setVillagesList([])
                : setVillagesList(
                    Villages(
                      state.province,
                      state.district,
                      state.sector,
                      e.target.value,
                    ),
                  );
            }}
            className="w-full rounded-lg border border-stroke bg-transparent p-2 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">All Cells</option>
            {cellsList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Village dropdown */}
          <select
            required
            value={state.village}
            onChange={(e) =>
              setState((prev: any) => ({
                ...prev,
                village: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-stroke bg-transparent p-2 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">All Villages</option>
            {villagesList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          {props.filters &&
            props.filters.map((filter, position) => (
              <select
                title={`Select ${filter.label}`}
                key={position}
                required
                value={state[filter.name]}
                onChange={(e) =>
                  setState((prev: any) => ({
                    ...prev,
                    [filter.name]: filter.valueType
                      ? convertValue(e.target.value, filter.valueType)
                      : e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-stroke bg-transparent p-2 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Select {filter.label}</option>
                {filter.options.map((option, index) => (
                  <option key={index} value={option.value as any}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
        </div>
      ) : (
        <>
          {props.filters && (
            <div
              className={`grid grid-cols-2 md:grid-cols-${
                props.columns ? props.columns : 5
              } gap-2`}
            >
              {props.filters.map((filter, position) => (
                <select
                  key={position}
                  required
                  value={state[filter.name]}
                  onChange={(e) =>
                    setState((prev: any) => ({
                      ...prev,
                      [filter.name]: filter.valueType
                        ? convertValue(e.target.value, filter.valueType)
                        : e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent p-2 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Select {filter.label}</option>
                  {filter.options.map((option, index) => (
                    <option key={index} value={option.value as any}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Filter;
