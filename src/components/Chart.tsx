/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { memo, use, useEffect, useRef, useState } from "react";
import { stColumnLayer, sublayersAll, buildingLayer } from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import {
  makeQuery,
  resetAllLayers,
  stackColumnChartData,
  stackColumnChartRender,
  thousands_separators,
  zoomToLayer,
} from "../query";
import "@esri/calcite-components/components/calcite-button";
import SubLayerView from "@arcgis/core/views/layers/BuildingComponentSublayerView";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { MyContext } from "../contexts/MyContext";
import {
  station_name_f,
  station_names_q,
  status_f,
  status_q,
  types_q,
} from "../uniqueValues";
import { queryDefinitionExpression } from "../qQueryExpression";
import { useQuery } from "@tanstack/react-query";
import { legendSetter, rootSetter } from "../chartSetter";
import ChartStackColumnRender, { resetQuerc } from "chart-stack-column-render";
import ChartStackColumns from "chart-stack-column";

// Draw chart
const Chart = memo(() => {
  const { stations } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;

  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const chartID = "station-bar";

  //--- Sublayerview
  const [sublayerViewFilter, setSublayerViewFilter] = useState<
    SubLayerView | any
  >();

  //-----------------------------------------------------//
  //              Initially Load building layer          //
  //-----------------------------------------------------//
  // else no chart
  const [buildingLayerLoaded, setLotLayerLoaded] = useState<any>(null);
  const arcgisBuildingExplorer = document.querySelector(
    "arcgis-building-explorer",
  );

  //--- Wait until building layer is loaded
  useEffect(() => {
    buildingLayer.load().then(() => {
      setLotLayerLoaded(buildingLayer.loadStatus);
    });
  }, []);

  //--- Building Explorer accepts building layer when ready
  useEffect(() => {
    if (buildingLayerLoaded !== "loaded" || !arcgisBuildingExplorer) return;
    arcgisBuildingExplorer.layers = [buildingLayer];
  }, [buildingLayerLoaded, buildingLayer]);

  //-----------------------------------------------------//
  //              Define Query expression                //
  //-----------------------------------------------------//
  //--- Common qValues and qFields for QueryExpressionLayers class
  const qV = [station_names_q.find((f: any) => f.name === stations)?.value];
  const qF = [station_name_f];
  const queryc = makeQuery(qV, qF);

  //-----------------------------------------------------//
  //              Generate Chart Data                    //
  //-----------------------------------------------------//
  const sublayersArray = sublayersAll.map((item: any) => item.layer);

  const { data } = useQuery<any>({
    queryKey: [types_q, stations],
    queryFn: async () => {
      //--- Reset queryc
      resetQuerc(queryc);

      queryDefinitionExpression({
        queryExpression: queryc.queryExpression(),
        featureLayer: sublayersArray,
      });

      const chartData = await stackColumnChartData({
        colchart: new ChartStackColumns(),
        qChart: queryc,
        categoryTypes: types_q,
        categoryTypeField: undefined,
        layers: sublayersArray,
        statusField: status_f,
        statusState: [1, 2, 3, 4],
      });

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

    const chartIconPositionX = 0;

    //-- Chart render
    stackColumnChartRender({
      render: new ChartStackColumnRender(),
      revit: true,
      layers: sublayersAll,
      root,
      chart,
      data: chartData,
      buildingLayer: buildingLayer,
      qChart: queryc,
      chartCategoryTypes: types_q,
      chartCategoryTypeField: undefined,
      statusTypename: ["Completed", "To be Constructed", "Under Construction"], //["Completed", "To be Constructed", "Under Construction"],
      statusStatename: ["comp", "incomp", "ongoing"], //["comp", "incomp", "ongoing"],
      statusArray: status_q,
      statusField: status_f,
      seriesStatusColor: status_q.map((c: any) => c.color),
      strokeColor: chartBorderLineColor,
      strokeWidth: chartBorderLineWidth,
      view: arcgisScene?.view,
      setLayerViewFilter: setSublayerViewFilter,
      new_chartIconSize,
      new_axisFontSize,
      chartIconPositionX,
      chartPaddingRightIconLabel,
      legend,
      updateChartPanelwidth: setChartPanelwidth,
    });
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
        qExpression: `${station_name_f} = ${queryc.qValues[0]}`,
      });
    }
  }, [resetButtonClicked, stations, chartData]);

  const primaryLabelColor = "#9ca3af";
  const valueLabelColor = "#d1d5db";

  return (
    <>
      <div
        slot="panel-end"
        style={{
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
          borderColor: "#555555",
        }}
      >
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
            alt="Land Logo"
            height={`${new_imageSize}%`}
            width={`${new_imageSize}%`}
            style={{ paddingTop: "20px", paddingLeft: "15px" }}
          />
          <dl style={{ alignItems: "center" }}>
            <dt
              style={{
                color: primaryLabelColor,
                fontSize: `${new_fontSize}px`,
                marginRight: "35px",
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
            height: "65.5vh",
            backgroundColor: "rgb(0,0,0,0)",
            color: "white",
            marginRight: "15px",
            marginLeft: "15px",
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
            onClick={() => setResetButtonClicked(!resetButtonClicked)}
          >
            Reset Chart Filter
          </calcite-button>
        </div>
      </div>
    </>
  );
});

export default Chart;
