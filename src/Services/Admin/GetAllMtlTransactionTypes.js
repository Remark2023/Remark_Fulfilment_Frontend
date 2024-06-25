import { getAllMtlTransactionTypes } from '../ApiServices';

export const getAllMtlTransactionTypesService = async () => {
  const response = await getAllMtlTransactionTypes();

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};