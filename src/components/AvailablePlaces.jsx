import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import {sortPlacesByDistance} from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places=await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
setIsFetching(false);
        });
        setError(null);
      } catch (error) {
        setError({
          message:
            error.message || "could not fetch places please try againg later",
        });
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);
  if (error) {
    return <Error title="an error occured " message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
      isLoading={isFetching}
      loadingText="Fetching Data ..."
    />
  );
}