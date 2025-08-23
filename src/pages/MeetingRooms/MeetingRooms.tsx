import Chatbot from "@/components/Rooms/ChatBot";
import RoomCard from "@/components/Rooms/RoomCard";
import RoomCardSkeleton from "@/components/Rooms/RoomCardSkeleton";
import RoomFilters from "@/components/Rooms/RoomFilters";
import { Button } from "@/components/ui/button";

import { useGetAllRoomsQuery } from "@/redux/features/rooms/roomsApi";
import { TRoom } from "@/types/global";
import { FilterIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

const MeetingRooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState("");
  const [capacity, setCapacity] = useState("");
  const [sort, setSort] = useState("");
  const [query, setQuery] = useState({});

  useEffect(() => {
    const timerId = setTimeout(() => {
      setQuery((prev) => ({ ...prev, searchTerm }));
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      price: priceRange,
      capacity: capacity,
      sort: sort,
    }));
  }, [priceRange, sort, capacity]);
  
  const { data: rooms, isLoading, isError } = useGetAllRoomsQuery(query);

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleClearFilters = () => {
    setPriceRange("");
    setCapacity("");
    setSort("");
  };

  return (
    <div className="py-10">
      <div className="lg:container mx-auto px-6 md:px-12">
        <h1 className="text-[28px] md:text-[36px] font-bold text-center text-primary mb-2">
          Explore Our Meeting Rooms
        </h1>
        <p className=" text-center text-lg text-gray-600 mb-12">
          Find the perfect space for your next meeting or event. Browse through
          our available rooms and choose the one that suits your needs.
        </p>
        <div className="flex flex-col md:flex-row justify-normal md:justify-between md:items-center mb-12 gap-4">
          <input
            type="text"
            placeholder="Search rooms..."
            className="w-[250px] md:w-[450px] bg-transparent p-2 border-2 border-secondary rounded-md "
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="relative">
            <Button
              className="bg-primary space-x-1 hover:bg-secondary"
              onClick={handleToggleFilters}
            >
              <span>Filters</span>
              <FilterIcon size={18} />
            </Button>
            {showFilters && (
              <RoomFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                capacity={capacity}
                setCapacity={setCapacity}
                sort={sort}
                setSort={setSort}
                handleClear={handleClearFilters}
              />
            )}
          </div>
        </div>
        {isError ? (
          <p>No data found....</p>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <RoomCardSkeleton key={index}/>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rooms.data
              .filter((room: TRoom) => !room.isDeleted)
              .map((room: TRoom, index: number) => (
                <RoomCard key={index} room={room} />
              ))}
          </div>
        )}
      </div>
      <div>
        <Chatbot/>
      </div>
    </div>
  );
};

export default MeetingRooms;
