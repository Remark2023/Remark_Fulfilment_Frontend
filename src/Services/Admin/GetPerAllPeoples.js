import { getPerAllPeoplesDetails } from '../ApiServices';

export const getPerAllPeoplesService = async () => {
  const response = await getPerAllPeoplesDetails();

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};