/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { use, useEffect, useRef, useState } from "react";
import {
  stColumnLayer,
  sublayersAll,
  queryc,
  chartstack,
  buildingLayer,
} from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { resetAllLayers, thousands_separators, zoomToLayer } from "../query";
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
import { queryDefinitionExpression } from "../qQueryExpression";
import { useQuery } from "@tanstack/react-query";
import { legendSetter, rootSetter } from "../chartSetter";
import ChartStackColumnRender, { resetQuerc } from "chart-stack-column-render";

// Draw chart
const Chart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const { stations } = use(MyContext);
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [sublayerViewFilter, setSublayerViewFilter] = useState<
    SubLayerView | any
  >();
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);
  const chartID = "station-bar";

  const sublayersArray = sublayersAll.map((item: any) => item.layer);

  const { data } = useQuery<any>({
    queryKey: [structureTypes, stations],
    queryFn: async () => {
      //--- Reset queryc
      resetQuerc(queryc);

      //--- Define query
      queryc.qValues = [
        stationNamesArray.find((item: any) => item.name === stations)?.value,
      ];
      queryc.qFields = [stationName_field];

      queryDefinitionExpression({
        queryExpression: queryc.queryExpression(),
        featureLayer: sublayersArray,
      });

      chartstack.qChart = queryc.queryExpression();
      chartstack.layers = sublayersArray;
      chartstack.categoryTypes = structureTypes;
      chartstack.categoryTypeField = undefined;
      chartstack.statusState = [1, 2, 3, 4];
      const chartData = await chartstack.chartDataStackColumns();

      zoomToLayer(stColumnLayer, arcgisScene);

      return {
        chartData: chartData[0] || [],
        totaln: chartData[1] || 0,
        perc: chartData[2] || 0,
      };
    },
    // staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const chartData = data?.chartData || [];
  const totaln = data?.totaln || 0;
  const perc_comp = data?.perc || 0;

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
  const chartPaddingRightIconLabel = 10;

  //-------------------------------------//
  //    Responsive Chart parameters      //
  //-------------------------------------//
  const new_fontSize = chartPanelwidth / 20;
  const new_valueSize = new_fontSize * 1.55;
  const new_chartIconSize = chartPanelwidth * 0.07;
  const new_axisFontSize = chartPanelwidth * 0.036;
  const new_imageSize = chartPanelwidth * 0.035;

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });

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

    const legend = legendSetter({
      chart: chart,
      root: root,
      centerX: 50,
      centerY: 50,
      x: 50,
      marginTop: 20,
      scale: 0.9,
      layout: root.horizontalLayout,
    });
    legendRef.current = legend;

    const crender = new ChartStackColumnRender(
      true,
      sublayersAll,
      root,
      chart,
      chartData,
      buildingLayer,
      queryc,
      structureTypes,
      undefined,
      ["Completed", "To be Constructed", "Under Construction"], //["Completed", "To be Constructed", "Under Construction"],
      ["comp", "incomp", "ongoing"], //["comp", "incomp", "ongoing"],
      statusArray,
      status_field,
      chart_colors,
      chartBorderLineColor,
      chartBorderLineWidth,
      arcgisScene?.view,
      setSublayerViewFilter,
      new_chartIconSize,
      new_axisFontSize,
      undefined,
      chartPaddingRightIconLabel,
      legend,
      setChartPanelwidth,
    );
    crender.chartRendererColumn();

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  useEffect(() => {
    if (sublayerViewFilter) {
      sublayerViewFilter.filter = new FeatureFilter({
        where: undefined,
      });

      resetAllLayers({
        layers: sublayersAll,
        qExpression: `${stationName_field} = ${queryc.qValues[0]}`,
      });
    }
  }, [resetButtonClicked, stations]);

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
            {perc_comp} %
          </dd>
          <div
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}*0.5px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
            }}
          >
            ({thousands_separators(totaln)})
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
