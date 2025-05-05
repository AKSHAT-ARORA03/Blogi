'use client';

import SearchBarClient from './SearchBarClient';

type SearchBarProps = {
  basePath: string;
};

export default function SearchBar({ basePath }: SearchBarProps) {
  // Use a default empty string for initial search term
  const initialSearchTerm = '';

  return <SearchBarClient basePath={basePath} initialSearchTerm={initialSearchTerm} />;
}
