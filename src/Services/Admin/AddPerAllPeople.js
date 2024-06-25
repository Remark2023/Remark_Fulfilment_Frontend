/* eslint-disable import/named */
import { addPerAllPeopleDetails } from "../ApiServices";

export const addPerAllPeopleService = async (people) => {
  console.log("people for admin page",people);
  const response = await addPerAllPeopleDetails(people);

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};