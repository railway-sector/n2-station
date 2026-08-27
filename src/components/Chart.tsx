/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { memo, use, useEffect, useMemo, useRef, useState } from "react";
import { sublayersAll, buildingLayer, stationLayer } from "../layers";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { resetAllLayers, thousands_separators, zoomToLayer } from "../query";
import "@esri/calcite-components/components/calcite-button";
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
import ChartStackColumnRender from "chart-stack-column-render";
import ChartStackColumns from "chart-stack-column";
import QueryExpressionLayers from "query-layers-expression";

const CHART_ID = "station-bar";

// Static layout constants (do not depend on props/state, so hoisted out of the component)
const CHART_MARGINS = {
  marginTop: 0,
  marginLeft: 0,
  marginRight: 0,
  marginBottom: 0,
};
const CHART_PADDING = {
  paddingTop: 10,
  paddingLeft: 5,
  paddingRight: 5,
  paddingBottom: 0,
};
const CHART_ICON_POSITION_X = 0;
const CHART_PADDING_RIGHT_ICON_LABEL = 10;
const CHART_BORDER_LINE_COLOR = "#00c5ff";
const CHART_BORDER_LINE_WIDTH = 0.4;
const STATUS_TYPE_NAMES: any = [
  "Completed",
  "To be Constructed",
  "Under Construction",
];
const STATUS_STATE_NAMES: any = ["comp", "incomp", "ongoing"];

const labelColor = "#9ca3af";
const valueColor = "#d1d5db";

//------------------------------//
//        useStationData        //
//------------------------------//
function useStationData(
  stations: string,
  query: any,
  sublayersArray: any,
  arcgisScene: any,
) {
  return useQuery<any>({
    queryKey: [stations, stationLayer],
    queryFn: async () => {
      queryDefinitionExpression({
        queryExpression: query.queryExpression(),
        featureLayer: sublayersArray,
      });

      const chartData = await new ChartStackColumns({
        where: query,
        categoryTypes: types_q,
        categoryTypeField: undefined,
        layers: sublayersArray,
        statusField: status_f,
        statusState: [1, 2, 3, 4],
      }).chartDataStackColumns();

      stationLayer.definitionExpression = `Station = '${stations}'`;
      zoomToLayer(stationLayer, arcgisScene);

      return {
        chartData: chartData[0] || [],
        totaln: chartData[1] || 0,
        perc: chartData[2] || 0,
      };
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// Draw chart
const Chart = memo(() => {
  const { stations } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;

  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const [resetLayerview, setResetLayerview] = useState<boolean>(false);
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});

  //-----------------------------------------------------//
  //              Initially Load building layer          //
  //-----------------------------------------------------//
  const [buildingLayerLoaded, setBuildingLayerLoaded] = useState<string | null>(
    null,
  );

  //--- Wait until building layer is loaded
  useEffect(() => {
    buildingLayer.load().then(() => {
      setBuildingLayerLoaded(buildingLayer.loadStatus);
    });
  }, []);

  //--- Building Explorer accepts building layer when ready
  useEffect(() => {
    if (buildingLayerLoaded !== "loaded") return;
    const arcgisBuildingExplorer = document.querySelector(
      "arcgis-building-explorer",
    ) as any;
    if (!arcgisBuildingExplorer) return;
    arcgisBuildingExplorer.layers = [buildingLayer];
  }, [buildingLayerLoaded]);

  //--- Query expression
  // Memoized so React Query's key comparison and the render effects below
  // don't see a "new" object on every render.
  const q1 = useMemo(
    () =>
      new QueryExpressionLayers({
        qFields: [station_name_f],
        qValues: [station_names_q.find((f: any) => f.name === stations)?.value],
      }),
    [stations],
  );

  //-----------------------------------------------------//
  //              Generate Chart Data                    //
  //-----------------------------------------------------//
  const sublayersArray = sublayersAll.map((item: any) => item.layer);

  const { data } = useStationData(stations, q1, sublayersArray, arcgisScene);
  const chartData = data?.chartData || [];
  const totaln = data?.totaln || 0;
  const perc_comp = data?.perc || 0;

  const fontSize = chartPanelwidth / 20;
  const valueSize = fontSize * 1.55;
  const chartIconSize = chartPanelwidth * 0.07;
  const axisFontSize = chartPanelwidth * 0.036;
  const imageSize = chartPanelwidth * 0.035;

  useEffect(() => {
    const root = rootSetter({ chartID: CHART_ID });
    root.setThemes([]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        ...CHART_MARGINS,
        ...CHART_PADDING,
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

    //-- Chart render
    new ChartStackColumnRender({
      revit: true,
      layers: sublayersAll,
      root,
      chart,
      data: chartData,
      buildingLayer: buildingLayer,
      where: q1,
      chartCategoryTypes: types_q,
      chartCategoryTypeField: undefined,
      statusTypename: STATUS_TYPE_NAMES,
      statusStatename: STATUS_STATE_NAMES,
      statusArray: status_q,
      statusField: status_f,
      seriesStatusColor: status_q.map((c: any) => c.color),
      strokeColor: CHART_BORDER_LINE_COLOR,
      strokeWidth: CHART_BORDER_LINE_WIDTH,
      view: arcgisScene?.view,
      new_chartIconSize: chartIconSize,
      new_axisFontSize: axisFontSize,
      chartIconPositionX: CHART_ICON_POSITION_X,
      chartPaddingRightIconLabel: CHART_PADDING_RIGHT_ICON_LABEL,
      legend,
      updateChartPanelwidth: setChartPanelwidth,
    }).chartRendererColumn();

    return () => {
      root.dispose();
    };
    // axisFontSize/chartIconSize derive from chartPanelwidth, which is itself
    // set by the renderer (updateChartPanelwidth) — including it here would
    // cause an infinite re-render loop, so it's deliberately left out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, stations, q1]);

  useEffect(() => {
    resetAllLayers({
      layers: sublayersAll,
      qExpression: `${station_name_f} = ${q1.qValues?.[0]}`,
    });
  }, [resetLayerview, q1]);

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
          width: "33vw",
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
            height={`${imageSize}%`}
            width={`${imageSize}%`}
            style={{ paddingTop: "20px", paddingLeft: "15px" }}
          />
          <dl style={{ alignItems: "center" }}>
            <dt
              style={{
                color: labelColor,
                fontSize: `${fontSize}px`,
                marginRight: "35px",
              }}
            >
              TOTAL PROGRESS
            </dt>
            <dd
              style={{
                color: valueColor,
                fontSize: `${valueSize}px`,
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
                color: valueColor,
                fontSize: `${valueSize}*0.5px`,
                fontFamily: "calibri",
                lineHeight: "1.2",
              }}
            >
              ({thousands_separators(totaln)})
            </div>
          </dl>
        </div>
        <div
          id={CHART_ID}
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
            onClick={() => setResetLayerview(!resetLayerview)}
          >
            Reset Chart Filter
          </calcite-button>
        </div>
      </div>
    </>
  );
});

export default Chart;
