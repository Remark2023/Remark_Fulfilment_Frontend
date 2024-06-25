/* eslint-disable camelcase */

import { getPerAllMtlTransactionTypes } from '../ApiServices';

export const getPerAllMtlTransactionTypesService = async (transaction_type_id) => {
  console.log("getper",transaction_type_id);
  const response = await getPerAllMtlTransactionTypes( transaction_type_id );

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};