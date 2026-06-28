/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { use, useEffect, useRef, useState } from "react";
import {
  stColumnLayer,
  stFoundationLayer,
  stFramingLayer,
  columnsLayer,
  floorsLayer,
  wallsLayer,
  exteriorShellLayer,
  sublayersAll,
  queryc,
} from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { thousands_separators, zoomToLayer } from "../Query";
import "@esri/calcite-components/components/calcite-button";
import SubLayerView from "@arcgis/core/views/layers/BuildingComponentSublayerView";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { MyContext } from "../contexts/MyContext";
import {
  chart_colors,
  stationName_field,
  stationNamesArray,
  status_field,
  statusArray,
  structureTypes,
} from "../uniqueValues";
import { queryDefinitionExpression } from "../QueryExpression";
import { chartRenderer, resetAllLayers } from "../ChartRenderer";
import { chartDataStackColumns } from "../ChartDataGenerator";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

// Draw chart
const Chart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const { stations, updateChartPanelwidth, chartPanelwidth } = use(MyContext);
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [chartData, setChartData] = useState<any>([]);
  const [totalNumber, setTotalNumber] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [sublayerViewFilter, setSublayerViewFilter] = useState<
    SubLayerView | any
  >();
  const highlightedSublayerView = useRef<any>(undefined);
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);
  const chartID = "station-bar";

  useEffect(() => {
    queryc.qValues = [
      stationNamesArray.find((item: any) => item.name === stations)?.value,
    ];
    queryc.qFields = [stationName_field];
    // const qe = queryExpression({
    //   q1Value: stationNamesArray.find((item: any) => item.name === stations)
    //     ?.value,
    //   q1Field: stationName_field,
    // });

    queryDefinitionExpression({
      queryExpression: queryc.queryExpression(),
      featureLayer: [
        stFoundationLayer,
        stColumnLayer,
        stFramingLayer,
        floorsLayer,
        wallsLayer,
        columnsLayer,
      ],
    });

    const sublayersArray = sublayersAll.map((item: any) => item.layer);

    chartDataStackColumns({
      qChart: queryc.queryExpression(),
      chartCategoryTypes: structureTypes,
      chartCategoryTypeField: undefined,
      layers: sublayersArray,
      statusState: [1, 2, 3, 4],
      statusField: status_field,
    }).then((response: any) => {
      setChartData(response[0]);
      setTotalNumber(response[1]);
      setProgress(response[2]);
    });

    stColumnLayer && zoomToLayer(stFramingLayer, arcgisScene);

    const resetChartFilterButton = document.querySelector(
      `[id=filterButton]`,
    ) as HTMLDivElement;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !stations
      ? (resetChartFilterButton.hidden = true)
      : (resetChartFilterButton.hidden = false);
  }, [stations]);

  // Define parameters
  const marginTop = 0;
  const marginLeft = 0;
  const marginRight = 0;
  const marginBottom = 0;
  const paddingTop = 10;
  const paddingLeft = 5;
  const paddingRight = 5;
  const paddingBottom = 0;
  const chartBorderLineColor = "#00c5ff";
  const chartBorderLineWidth = 0.4;
  const chartPaddingRightIconLabelSpace = 10;

  //-------------------------------------//
  //    Responsive Chart parameters      //
  //-------------------------------------//
  const new_fontSize = chartPanelwidth / 20;
  const new_valueSize = new_fontSize * 1.55;
  const new_chartIconSize = chartPanelwidth * 0.07;
  const new_axisFontSize = chartPanelwidth * 0.036;
  const new_imageSize = chartPanelwidth * 0.035;

  useEffect(() => {
    exteriorShellLayer.visible = false;
    maybeDisposeRoot(chartID);

    const root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginBottom: marginBottom,
        paddingTop: paddingTop,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        scale: 1,
        height: am5.percent(100),
      }),
    );
    chartRef.current = chart;

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        centerY: am5.percent(50),
        x: am5.percent(60),
        y: am5.percent(97),
        marginTop: 20,
        scale: 0.8,
        layout: root.horizontalLayout,
      }),
    );
    legendRef.current = legend;

    chartRenderer({
      root: root,
      chart: chart,
      data: chartData,
      chartCategoryTypes: structureTypes,
      chartCategoryField: undefined,
      q1Value: stationNamesArray.find((item: any) => item.name === stations)
        ?.value,
      q1Field: stationName_field,
      statusTypename: ["Completed", "To be Constructed", "Under Construction"], //["Completed", "To be Constructed", "Under Construction"],
      statusStatename: ["comp", "incomp", "ongoing"], //["comp", "incomp", "ongoing"],
      statusArray: statusArray,
      statusField: status_field,
      seriesStatusColor: chart_colors,
      strokeColor: chartBorderLineColor,
      strokeWidth: chartBorderLineWidth,
      arcgisScene: arcgisScene,
      setSublayerViewFilter: setSublayerViewFilter,
      sublayersCollection: sublayersAll,
      highlightedSublayerView: highlightedSublayerView,
      chartPaddingRightIconLabelSpace: chartPaddingRightIconLabelSpace,
      new_chartIconSize: new_chartIconSize,
      new_axisFontSize: new_axisFontSize,
      legend: legend,
      updateChartPanelwidth: updateChartPanelwidth,
    });
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  useEffect(() => {
    highlightedSublayerView.current && highlightedSublayerView.current.remove();

    if (sublayerViewFilter) {
      sublayerViewFilter.filter = new FeatureFilter({
        where: undefined,
      });
      resetAllLayers({ layers: sublayersAll });
    }
  }, [resetButtonClicked]);

  const primaryLabelColor = "#9ca3af";
  const valueLabelColor = "#d1d5db";

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "3px",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Station_Structures_icon.svg"
          alt="Station Structure Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{ paddingTop: "20px" }}
        />
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{
              color: primaryLabelColor,
              fontSize: `${new_fontSize}px`,
              marginRight: "20px",
            }}
          >
            TOTAL PROGRESS
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
            }}
          >
            {progress} %
          </dd>
          <div
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}*0.5px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
            }}
          >
            ({thousands_separators(totalNumber)})
          </div>
        </dl>
      </div>
      <div
        id={chartID}
        style={{
          height: "64vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginTop: "3%",
        }}
      ></div>
      <div
        id="filterButton"
        style={{
          width: "50%",
          marginLeft: "30%",
          paddingTop: "5%",
        }}
      >
        <calcite-button
          iconEnd="reset"
          onClick={() =>
            setResetButtonClicked(resetButtonClicked === false ? true : false)
          }
        >
          Reset Chart Filter
        </calcite-button>
      </div>
    </>
  );
};

export default Chart;
