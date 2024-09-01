import { Dispatch, SetStateAction, useState } from "react";
import { domains } from "~/utils/domains";

interface IProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}

export default function Select({ value, onChange }: IProps) {
  const [expanded, setExpanded] = useState(false);

  const options = Object.keys(domains);

  return (
    <>
      <div className="relative mt-2">
        <button
          type="button"
          className="text-gray-900 ring-gray-300 relative w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
          aria-haspopup="listbox"
          aria-expanded={expanded}
          onClick={() => {
            setExpanded(!expanded);
          }}
          aria-labelledby="listbox-label"
        >
          <span className="flex items-center">
            <span className=" block truncate">{value}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg
              className="text-gray-400 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
        {expanded && (
          <ul
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            tabIndex={-1}
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-option-3"
          >
            {options.map((val: string) => (
              <li
                className="text-gray-900 relative cursor-pointer select-none py-2 pl-3 pr-9"
                id="listbox-option-0"
                role="option"
                aria-selected={value === val}
                key={val}
                onClick={() => {
                  onChange(val);
                  setExpanded(false);
                }}
              >
                <div className="flex items-center">
                  <span className="ml-3 block truncate font-normal">{val}</span>
                </div>
                {value === val && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
