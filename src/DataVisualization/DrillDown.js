import { FieldChooser, PivotGrid } from 'devextreme-react/pivot-grid';
import 'devextreme/dist/css/dx.light.css';
import { useEffect, useState } from 'react';
import { getDrillView, getUserProfileDetails } from '../Services/ApiServices';
import { useUser } from '../context/UserContext'; // Assuming you have a user context

const PivotGridTable = () => {
  const [userList, setUserList] = useState([]);
  const { user } = useUser();
  const [account, setAccount] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        if (user) {
          const accountDetails = await getUserProfileDetails(user); // Assuming this function is defined
          if (accountDetails.status === 200) {
            setAccount(accountDetails.data);
          }
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (account) {
          console.log(account.user_id);
          const response = await getDrillView(user); // Assuming this function is defined

          if (response.status === 200) {
            setUserList(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, [account]);

  const sampleData = userList.map((item) => ({
    companyAccount: item.company_account, // Assuming deposit_type_name as category
    companyName: item.company_name, // Assuming company_name as subcategory
    customerName: item.customer_name, // Assuming customer_name as product
    depositTypeName: item.deposit_type_name, // Assuming date is constant
    sum: item.sum,
  }));

  const dataSource = {
    store: {
      type: 'array',
      key: 'sum', // Assuming 'sum' can act as a unique identifier
      data: sampleData,
    },
    fields: [
      {
        caption: 'Deposit Type',
        dataField: 'depositTypeName',
        area: 'row',
      },

      {
        caption: 'Company Name',
        dataField: 'companyName',
        area: 'row',
      },
      {
        caption: 'Company Account',
        dataField: 'companyAccount',
        area: 'row',
      },

      {
        caption: 'Customer Name',
        dataField: 'customerName',
        area: 'row',
      },

      {
        caption: 'Company Account',
        dataField: 'companyAccount',
        area: 'column',
      },

      {
        caption: 'Customer Name',
        dataField: 'customerName',
        area: 'column',
      },

      {
        caption: 'Sum',
        dataField: 'sum',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      },
    ],
  };

  console.log(userList);

  return (
    <>
      <PivotGrid
        id="pivotGrid"
        showBorders
        dataSource={dataSource} // Change this to userList or the data received from API
        allowSorting
        allowSortingBySummary
        allowFiltering
        height={600}
        width={'100%'}
      >
        <FieldChooser enabled />
      </PivotGrid>
    </>
  );
};

export default PivotGridTable;
