import PieChart, {
  Connector,
  Export,
  Label,
  Legend,
  Series,
  SmallValuesGrouping,
} from 'devextreme-react/pie-chart';
import { dataSource } from './dataPieChart';

function formatLabel(arg) {
return `${arg.argumentText}: ${arg.valueText}%`;
}
function PieChartView() {
return (
  <PieChart
    id="pie"
    dataSource={dataSource}
    palette="Bright"
    title="Top internet languages"
  >
    <Series
      argumentField="language"
      valueField="percent"
    >
      <Label
        visible
        customizeText={formatLabel}
        format="fixedPoint"
      >
        <Connector
          visible
          width={0.5}
        />
      </Label>
      <SmallValuesGrouping
        threshold={4.5}
        mode="smallValueThreshold"
      />
    </Series>
    <Legend
      horizontalAlignment="center"
      verticalAlignment="bottom"
    />
    <Export enabled />
  </PieChart>
);
}
export default PieChartView;
