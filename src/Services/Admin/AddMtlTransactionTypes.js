/* eslint-disable import/named */
import { addMtlTransactionTypesDetails } from "../ApiServices";

export const addMtlTransactionTypes = async (transaction) => {
  console.log("mtl for admin page",transaction);
  const response = await addMtlTransactionTypesDetails(transaction);

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};