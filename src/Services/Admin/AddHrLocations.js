/* eslint-disable import/named */
import { addHrLocationsDetails } from "../ApiServices";

export const addHrLocationsDetailsService = async (location) => {
  console.log("location for admin page",location);
  const response = await addHrLocationsDetails(location);

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};