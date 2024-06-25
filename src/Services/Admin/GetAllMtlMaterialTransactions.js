import { getAllMtlTransactions } from '../ApiServices';

export const getAllMtlTransactionsService = async () => {
  const response = await getAllMtlTransactions();

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};