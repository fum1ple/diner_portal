import React from 'react';

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface SearchFormProps {
  name: string;
  area: string;
  genre: string;
  areaTags: Tag[];
  genreTags: Tag[];
  loading: boolean;
  onNameChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  name,
  area,
  genre,
  areaTags,
  genreTags,
  loading,
  onNameChange,
  onAreaChange,
  onGenreChange,
  onSubmit,
  onClear,
}) => (
  <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-md mb-8">
      <input
        type="text"
        placeholder="店舗名で検索"
        value={name}
        onChange={e => onNameChange(e.target.value)}
        className="w-full md:w-auto flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <select
        value={area}
        onChange={e => onAreaChange(e.target.value)}
        className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        <option value="">すべてのエリア</option>
        {areaTags.map(tag => (
          <option key={tag.id} value={tag.name}>{tag.name}</option>
        ))}
      </select>
      <select
        value={genre}
        onChange={e => onGenreChange(e.target.value)}
        className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        <option value="">すべてのジャンル</option>
        {genreTags.map(tag => (
          <option key={tag.id} value={tag.name}>{tag.name}</option>
        ))}
      </select>
      <button
        type="submit"
        className="w-full md:w-auto px-6 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition whitespace-nowrap disabled:bg-gray-400"
        disabled={loading}
      >
        検索
      </button>
      <button
        type="button"
        className="w-full md:w-auto px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition whitespace-nowrap disabled:bg-gray-400"
        onClick={onClear}
        disabled={loading}
      >
        クリア
      </button>
    </form>
);

export default SearchForm;