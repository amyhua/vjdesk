"use client";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CategoryDatum } from "@/types";
import Fuse from "fuse.js";
import { categoriesApiUrl, clipsApiUrl } from "@/modules/config";
import path from "path";
import { fetchJson } from "@/modules/fetch";
import Categories from "@/contexts/CategoriesContext";

const deserializeCategories = (categories: string) => {
  return categories.split("|");
};
const serializeCategories = (categories: string[]) => categories.join("|");
const addCat = (categories: string[], cat: string) => {
  if (categories.includes(cat)) return categories;
  return [...categories, cat].sort();
};
const postFileCats = async (file: string, categories: string[]) => {
  await fetchJson("POST", clipsApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      file: encodeURIComponent(file),
      categories: serializeCategories(categories)
    })
  });
};

export default function CategoriesAutocomplete({
  file,
  fileCategories
}: {
  file: string;
  fileCategories: string[];
}) {
  const { categories, setCategories } = useContext(Categories);
  const [fileCats, setFileCats] = useState<string[]>(fileCategories);
  const [fuse, setFuse] = useState<Fuse<CategoryDatum> | null>(null);
  const [selected, setSelected] = useState<CategoryDatum | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CategoryDatum[]>([]);

  const fetchFileCategories = useCallback(async () => {
    const fileData = (await fetchJson(
      "GET",
      `${clipsApiUrl}?file=${encodeURIComponent(file)}`
    )) as {
      id: string;
      file: string;
      categories: string;
    };
    if (fileData) {
      const cats = deserializeCategories(fileData.categories || "");
      setFileCats(cats);
      return cats;
    }
    return [];
  }, [file]);

  useEffect(() => {
    const fuse = new Fuse(categories as CategoryDatum[], {
      keys: ["name"],
      includeScore: true,
      includeMatches: true,
      threshold: 0.4
    });
    setFuse(fuse);
  }, [categories]);

  useEffect(() => {
    if (fuse && query) {
      const resultsVal = fuse.search(query);
      setResults(resultsVal.map((r) => r.item));
    }
  }, [query]);

  const filteredCats = useMemo(() => {
    return !query
      ? categories
      : categories.filter((category) =>
          category.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  }, [query, categories]);

  const onChange = (cat: CategoryDatum) => {
    if (!cat) return;
    setSelected(cat);
    setQuery(cat.name);
    postFileCats(file, addCat(fileCats, cat.name));
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCat(query)();
  };
  const createCat = useCallback(
    (name: string) => async () => {
      const data = (await fetchJson("POST", categoriesApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      })) as {
        id: string;
        name: string;
      };
      if (data) {
        setCategories([...categories, { id: data.id, name: data.name }]);
        setQuery(data.name);
        onChange({ id: data.id, name: data.name });
        await postFileCats(file, addCat(fileCats, data.name));
        fetchFileCategories();
      }
    },
    [categories]
  );

  return (
    <div className="relative w-full">
      <div>
        {fileCats.map((name) => (
          <span
            key={name}
            className="inline-block px-2 py-1 mr-1 bg-white text-black text-xs rounded-full"
          >
            {name}
          </span>
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <Combobox value={selected} onChange={onChange}>
          <div className="relative bg-transparent border-b mb-4 ">
            <div className="relative w-full cursor-default overflow-hidden bg-transparent text-left shadow-md focus:outline-none sm:text-sm">
              <Combobox.Input
                placeholder="Category"
                className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-white bg-transparent focus:outline-none focus:ring-0 focus:bg-white/10"
                displayValue={(cat: CategoryDatum) => cat?.name}
                onKeyDown={(event) => {
                  // on hit Enter, trigger onSubmit
                  if (event.key === "Enter") {
                    event.preventDefault();
                    event.stopPropagation();
                    onSubmit(event);
                  }
                }}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {filteredCats.length === 0 && query !== "" ? (
                  <div
                    onClick={createCat(query)}
                    className="cursor-pointer relative select-none px-4 py-2 text-gray-700"
                  >
                    Create new category{" "}
                    <strong className="font-bold">{query}</strong>
                  </div>
                ) : (
                  filteredCats.map((cat) => (
                    <Combobox.Option
                      key={cat.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-teal-600 text-white" : "text-gray-900"
                        }`
                      }
                      value={cat}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {cat.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-teal-600"
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
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
      </form>
    </div>
  );
}
