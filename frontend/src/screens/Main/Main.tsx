import { useExperiences } from "../../hooks/useExperiences";
import { ExperienceOverviewSection } from "./sections/ExperienceOverviewSection";
import { ExperienceCardDynamic } from "./sections/ExperienceCardDynamic";

export const Main = (): JSX.Element => {
  const { experiences, loading, error, searchExperiences, clearFilters, searchParams } = useExperiences();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchExperiences(query.trim());
    } else {
      clearFilters();
    }
  };

  return (
    <div className="bg-[#f8f8f8] w-full flex flex-col">
      <ExperienceOverviewSection onSearch={handleSearch} loading={loading} />

      <div className="container mx-auto px-8 py-16">

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>Error loading experiences: {error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {experiences.map((experience) => (
              <ExperienceCardDynamic 
                key={experience.id} 
                experience={experience} 
              />
            ))}
          </div>
        )}
        
        {!loading && !error && experiences.length === 0 && !searchParams.search && (
          <div className="text-center py-12">
            <p className="text-gray-500">No experiences available at the moment.</p>
          </div>
        )}
        
        {!loading && !error && experiences.length === 0 && searchParams.search && (
          <div className="text-center py-12">
            <p className="text-gray-500">No experiences match your search criteria.</p>
            <button 
              onClick={clearFilters}
              className="mt-2 text-blue-500 hover:text-blue-700 underline"
            >
              View all experiences
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
