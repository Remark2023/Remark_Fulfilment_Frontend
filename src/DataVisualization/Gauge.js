import {
  CircularGauge,
  Font,
  Label,
  Range,
  RangeContainer,
  Scale,
  Title,
  Tooltip,
} from 'devextreme-react/circular-gauge';
import { SelectBox } from 'devextreme-react/select-box';
import { useCallback, useState } from 'react';
import { dataSource, seasonLabel } from './dataGauge';

function customizeText({ valueText }) {
  return `${valueText} °C`;
}
function App() {
    console.log(dataSource);
  const [value, setValue] = useState(dataSource[0].mean);
  const [subvalues, setSubvalues] = useState([dataSource[0].min, dataSource[0].max]);
  const onSelectionChanged = useCallback(
    ({ selectedItem }) => {
      setValue(selectedItem.mean);
      setSubvalues([selectedItem.min, selectedItem.max]);
    },
    [setValue, setSubvalues],
  );
  return (
    <div id="gauge-demo">
      <CircularGauge
        id="gauge"
        value={value}
        subvalues={subvalues}
      >
        <Scale
          startValue={10}
          endValue={100}
          tickInterval={5}
        >
          <Label customizeText={customizeText} />
        </Scale>
        <RangeContainer>
          <Range
            startValue={10}
            endValue={20}
            color="#0077BE"
          />
          <Range
            startValue={20}
            endValue={30}
            color="#E6E200"
          />
          <Range
            startValue={30}
            endValue={40}
            color="#77DD77"
          />
        </RangeContainer>
        <Tooltip enabled />
        <Title text="Sales Order Limit Showcase">
          <Font size={28} />
        </Title>
        
      </CircularGauge>
      <SelectBox
        id="seasons"
        width={150}
        inputAttr={seasonLabel}
        dataSource={dataSource}
        defaultValue={dataSource[0]}
        displayExpr="name"
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
}
export default App;
