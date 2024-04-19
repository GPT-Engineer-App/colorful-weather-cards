import { useState, useEffect } from "react";
import { Box, Flex, Input, InputGroup, InputLeftElement, SimpleGrid, Text, IconButton, useColorModeValue, Heading, Image, Button } from "@chakra-ui/react";
import { FaSearch, FaStar, FaRegStar } from "react-icons/fa";

const Index = () => {
  const [cities, setCities] = useState([
    { name: "London", id: 2643743 },
    { name: "Paris", id: 2988507 },
    { name: "Berlin", id: 2950159 },
    { name: "Madrid", id: 3117735 },
    { name: "Rome", id: 3169070 },
    { name: "Prague", id: 3067696 },
    { name: "Vienna", id: 2761369 },
    { name: "Amsterdam", id: 2759794 },
    { name: "Brussels", id: 2800866 },
    { name: "Stockholm", id: 2673730 },
  ]);
  const [weatherData, setWeatherData] = useState([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    const responses = await Promise.all(cities.map((city) => fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.id}&longitude=${city.id}&current_weather=true`).then((res) => res.json())));
    setWeatherData(
      responses.map((response, index) => ({
        ...response,
        city: cities[index].name,
      })),
    );
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const toggleFavorite = (city) => {
    if (favorites.includes(city)) {
      setFavorites(favorites.filter((fav) => fav !== city));
    } else {
      setFavorites([...favorites, city]);
    }
  };

  const filteredWeatherData = weatherData.filter((data) => data.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box p={5}>
      <Heading mb={4}>European Weather Dashboard</Heading>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.300" />
        </InputLeftElement>
        <Input placeholder="Search city" value={search} onChange={handleSearchChange} />
      </InputGroup>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {filteredWeatherData.map((data, index) => (
          <Box key={index} p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={useColorModeValue("white", "gray.700")}>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="xl" fontWeight="bold">
                {data.city}
              </Text>
              <IconButton icon={favorites.includes(data.city) ? <FaStar /> : <FaRegStar />} onClick={() => toggleFavorite(data.city)} aria-label="Add to favorites" colorScheme={favorites.includes(data.city) ? "yellow" : "gray"} />
            </Flex>
            <Text mt={2}>Temperature: {data.current_weather.temperature}°C</Text>
            <Text>Wind Speed: {data.current_weather.windspeed} km/h</Text>
            <Image src={`https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwxfHwlMjQlN0JkYXRhLmNpdHklN0QlMjBjaXR5c2NhcGV8ZW58MHx8fHwxNzEzNTE0NTA0fDA&ixlib=rb-4.0.3&q=80&w=1080`} alt={`${data.city} image`} mt={2} borderRadius="md" />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Index;
