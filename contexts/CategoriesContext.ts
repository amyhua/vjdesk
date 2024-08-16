import { CategoryDatum } from '@/types';
import React from 'react';

const Categories = React.createContext<{
  categories: CategoryDatum[];
  setCategories: (categories: CategoryDatum[]) => void;
}>({
  categories: [],
  setCategories: () => {}
});

export default Categories;
