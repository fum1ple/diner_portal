'use client';

import { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

interface Option {
  id: number | string;
  name: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  emptyMessage = "該当する項目がありません",
  disabled = false,
  className = ""
}: SearchableDropdownProps) {
  const [query, setQuery] = useState('');

  const selectedOption = options.find(option => option.name === value);

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className={className}>
      <Combobox value={selectedOption} onChange={(option) => option && onChange(option.name)} disabled={disabled}>
        <div className="relative">
          <div className="relative w-full">
            <Combobox.Input
              className="w-full border-2 border-teal-500 rounded-xl bg-white/80 py-3 pl-10 pr-10 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-400"
              displayValue={(option: Option | null) => option?.name ?? ''}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search
                className="h-4 w-4 text-teal-500"
                aria-hidden="true"
              />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              {selectedOption && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="flex items-center pr-2 hover:bg-teal-50 rounded-md transition-colors duration-150"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-teal-600" />
                </button>
              )}
              <Combobox.Button className="flex items-center pr-3">
                <ChevronDown
                  className="h-5 w-5 text-teal-500"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-teal-100">
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors duration-150 ${
                        active ? 'bg-teal-50 text-teal-900' : 'text-gray-900'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-teal-600' : 'text-teal-600'
                            }`}
                          >
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}