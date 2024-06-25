import { getfnduserDetails } from '../ApiServices';

export const getFndUserService = async () => {
  const response = await getfnduserDetails();

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};