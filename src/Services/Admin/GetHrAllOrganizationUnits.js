import { getHrAllOrganizationUnits } from '../ApiServices';

export const getHrAllOrganizationUnitsService = async () => {
  const response = await getHrAllOrganizationUnits();

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};