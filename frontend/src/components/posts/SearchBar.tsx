'use client';

import SearchBarClient from './SearchBarClient';

type SearchBarProps = {
  basePath: string;
};

export default function SearchBar({ basePath }: SearchBarProps) {
  return <SearchBarClient basePath={basePath} />;
}
