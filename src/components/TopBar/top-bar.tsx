import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type TopBarProps = {
  title: string;
  toggleSidebar: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export function TopBar({
  title,
  toggleSidebar,
  searchTerm,
  setSearchTerm,
}: TopBarProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow max-w-3xl">
              <Input
                type="search"
                placeholder="Buscar por ID, imobiliária, proponente ou hora..."
                className="pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-500 transition duration-150 ease-in-out"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 "
                size={20}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
