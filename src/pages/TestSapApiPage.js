import { useState } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';
import { createSalesOrderService, getSoDetailsService, getTokenService } from '../Services/ApiServices';

// ----------------------------------------------------------------------

export default function TestSapApiPage() {
  const initialUser = {
    id: '',
    password: '',
  };
  const [user, setUser] = useState(initialUser);

  const handleClick = async () => {
    try {
      const responseToken = await getTokenService();
      console.log(responseToken);
      console.log('token', responseToken.headers['x-csrf-token']);
      const token = responseToken.headers['x-csrf-token'];

      if (responseToken) {
        const requestBody = {
          SalesOrderType: 'OR',
          SalesOrganization: '6110',
          DistributionChannel: '10',
          OrganizationDivision: '00',
          SoldToParty: '1000003',
          PurchaseOrderByCustomer: 'Created via OData Service',
          CustomerPaymentTerms: '',
          to_Partner: [
            {
              PartnerFunction: 'SH',
              Customer: '61100001',
              Personnel: '0',
            },
          ],
          to_Text: [
            {
              Language: 'EN',
              LongTextID: 'TX01',
              LongText: 'Long text of LongTextID TX01',
            },
          ],
          to_Item: [
            {
              Material: 'TG11',
              RequestedQuantity: '100',
              to_PricingElement: [
                {
                  ConditionType: 'ZPR0',
                  ConditionRateValue: '10',
                  ConditionCurrency: 'USD',
                  ConditionQuantity: '100',
                  ConditionQuantityUnit: 'PC',
                },
              ],
            },
          ],
        };
        // const requestBody = {
        //   SalesOrderType: 'OR',
        //   SalesOrganization: '6110',
        //   DistributionChannel: '10',
        //   OrganizationDivision: '00',
        //   SoldToParty: '1000003',
        //   PurchaseOrderByCustomer: 'Created via OData Service',
        //   CustomerPaymentTerms: '',
        //   to_Partner: [
        //     {
        //       PartnerFunction: 'SH',
        //       Customer: '61100001',
        //       Personnel: '0',
        //     },
        //   ],
        //   to_Text: [
        //     {
        //       Language: 'EN',
        //       LongTextID: 'TX01',
        //       LongText: 'Long text of LongTextID TX01',
        //     },
        //   ],
        //   to_Item: [
        //     {
        //       Material: 'TG11',
        //       RequestedQuantity: '100',
        //       to_PricingElement: [
        //         {
        //           ConditionType: 'ZPR0',
        //           ConditionRateValue: '10',
        //           ConditionCurrency: 'USD',
        //           ConditionQuantity: '100',
        //           ConditionQuantityUnit: 'PC',
        //         },
        //       ],
        //     },
        //   ],
        // };

        console.log(token);
        const responseCreateSo = await createSalesOrderService(token, requestBody);
        console.log('create so', responseCreateSo);
      }
    } catch (error) {
      console.log('error', error.message);
      console.log('hello', user);
    }
  };

  const getSoDetails = async () => {
    try {
      const response = await getSoDetailsService(220);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Stack align="center" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Test SAP sales order service
        </Typography>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Create SO
      </LoadingButton>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={getSoDetails}>
        Get SO
      </LoadingButton>
    </>
  );
}
