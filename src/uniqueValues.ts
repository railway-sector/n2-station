import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D.js";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer.js";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";
import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";

//----------------------------------------------//
//              portalItem                      //
//----------------------------------------------//
const portalItem_url = { url: "https://gis.railway-sector.com/portal" };

export const portalItems = (id: any) => {
  return { id: id, portal: portalItem_url };
};

export const cpackages = ["N-01", "N-02", "N-03", "N-04"];

//----------------------------------------------//
//              Chart Parameters                //
//----------------------------------------------//
// chart width
export const chart_width = "26vw";
export const chart_box_width = 250;

// labeling and value label color
export const primaryLabelColor = "#9ca3af";
export const valueLabelColor = "#d1d5db";

//----------------------------------------------//
//            Alignment Layers                  //
//----------------------------------------------//
//--- PIER ACCESS POINT LAYER ---//
export const pier_access_label = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: valueLabelColor },
        size: 15,
        font: { family: "Ubuntu Mono", weight: "bold" },
      }),
    ],
    verticalOffset: {
      screenLength: 80,
      maxWorldLength: 500,
      minWorldLength: 30,
    },
    callout: {
      type: "line",
      size: 0.5,
      color: [0, 0, 0],
      border: { color: [255, 255, 255, 0.7] },
    },
  }),
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  labelPlacement: "above-center",
});

//--- CHAINAGE LAYER ---//
export const label_chainage = new LabelClass({
  labelExpressionInfo: { expression: "$feature.KmSpot" },
  symbol: {
    type: "text",
    color: [85, 255, 0],
    haloColor: "black",
    haloSize: 0.5,
    font: { size: 15, weight: "bold" },
  },
});

export const chainage_renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 5,
    color: [255, 255, 255, 0.9],
    outline: { width: 0.2, color: "black" },
  }),
});

//--- PROW LAYER ---//
// ORIGINAL (DEFAULT)
export const prow_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({ color: "#ff0000", width: "2px" }),
});

//--- STATION LAYER ---//
export const label_stationp = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: "#d4ff33" },
        size: 15,
        halo: { color: "black", size: 0.5 },
      }),
    ],
    verticalOffset: {
      screenLength: 100,
      maxWorldLength: 700,
      minWorldLength: 80,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: { color: "grey" },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: { expression: "$feature.Station" },
});

//-----------------------------------------------//
//              Stations Structure               //
//-----------------------------------------------//
export const type_f = "Type";
export const status_f = "Status";
export const category_f = "Category";
export const station_name_f = "Station";

export const status_q: any = [
  {
    value: 1,
    status: "incomp",
    label: "To be Constructed",
    color: "#000000",
    rgb: [225, 225, 225, 0.1],
  },
  {
    value: 2,
    status: "ongoing",
    label: "Under Construction",
    color: "#f7f7f7ff",
    rgb: [211, 211, 211, 0.5],
  },
  {
    value: 3,
    status: "delayed",
    label: "Delayed",
    color: "#FF0000",
    rgb: [255, 0, 0, 0.8],
  },
  {
    value: 4,
    status: "comp",
    label: "Completed",
    color: "#0070ff",
    rgb: [0, 112, 255, 0.8],
  },
];

//--- Station names
export const station_names_q: any = [
  { value: 8, name: "Calumpit" },
  { value: 7, name: "Apalit" },
  { value: 6, name: "San Fernando" },
  { value: 5, name: "Angeles" },
  { value: 4, name: "Clark" },
  { value: 3, name: "CIA" },
];

//--- Station Structure types
export const types_q = [
  { value: 1, category: "St.Foundation", modelName: "StructuralFoundation" },
  { value: 2, category: "St.Column", modelName: "StructuralColumns" },
  { value: 3, category: "St.Framing", modelName: "StructuralFraming" },
  { value: 5, category: "Floors", modelName: "Floors" },
  { value: 6, category: "Walls", modelName: "Walls" },
  { value: 7, category: "Columns", modelName: "Columns" },
];

//--- BUILDING SCENE LAYERS ---//
export const b_popup = {
  title: "{Station}",
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "Status", label: "Construction Status" },
        { fieldName: "Category", label: "Category" },
        { fieldName: "Status", label: "Construction Status" },
        { fieldName: "BldgLevel", label: "Building Level" },
      ],
    },
  ],
};

const b_uniqueV = [1, 2, 4].map((v: any) => {
  return {
    value: v,
    symbol: new MeshSymbol3D({
      symbolLayers: [
        new FillSymbol3DLayer({
          material: {
            color: status_q.find((f: any) => f.value === v).rgb,
            colorMixMode: "replace",
          },
          edges: new SolidEdges3D({ color: [225, 225, 225, 0.3] }),
        }),
      ],
    }),
  };
});

export const b_renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: b_uniqueV,
});

//-----------------------------------------------//
//              Media parameters                 //
//-----------------------------------------------//
export const image_scales = [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4];
export const img_size = 280;
export const timestamp_field = "timestamp";

//-----------------------------------------------//
//              Drone Image & Video              //
//-----------------------------------------------//
//--- DRONE IMAGE & VIDEO LAYERS ---//
interface LabelSymbolMedia {
  srcL: number;
  maxWL: number;
  minWL: number;
}

function labelSymbol3DMedia({ srcL, maxWL, minWL }: LabelSymbolMedia) {
  const symbol = new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: [255, 255, 0] },
        size: 15,
        halo: { color: "black", size: 0.5 },
      }),
    ],
    verticalOffset: {
      screenLength: srcL,
      maxWorldLength: maxWL,
      minWorldLength: minWL,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: { color: "grey" },
    },
  });
  return symbol;
}

//--- DRONE IMAGE LAYER ---//
export const label_image = new LabelClass({
  symbol: labelSymbol3DMedia({ srcL: 40, maxWL: 30, minWL: 20 }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.Type",
  },
});

//--- DRONE VIDEO LAYER ---//
export const label_video = new LabelClass({
  symbol: labelSymbol3DMedia({ srcL: 20, maxWL: 10, minWL: 10 }),
  labelPlacement: "above-center",
  labelExpressionInfo: { expression: "$feature.Type" },
});

//-----------------------------------------------//
//              Layer List                       //
//-----------------------------------------------//
export async function defineActions(event: any) {
  const { item } = event;
  if (item.layer.type !== "group") {
    item.panel = { content: "legend", open: true };
  }
  item.title === "Chainage" || item.title === "Exterior Shell"
    ? (item.visible = false)
    : (item.visible = true);
}
