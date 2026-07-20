import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import {
  b_popup,
  b_renderer,
  chainage_renderer,
  label_chainage,
  label_image,
  label_stationp,
  label_video,
  pier_access_label,
  portalItems,
  prow_renderer,
} from "./uniqueValues";

//----------------------------------------------//
//            Alignment Layers                  //
//----------------------------------------------//
//--- PIER ACCESS POINT LAYER ---//
export const pierAccessLayer = new FeatureLayer({
  portalItem: portalItems("876de8483da9485aac5df737cbef2143"),
  outFields: ["*"],
  layerId: 6,
  labelingInfo: [pier_access_label],
  title: "Pier Number",
  minScale: 150000,
  maxScale: 0,
  elevationInfo: { mode: "on-the-ground" },
});

//--- CHAINAGE LAYER ---//
export const chainageLayer = new FeatureLayer({
  portalItem: portalItems("876de8483da9485aac5df737cbef2143"),
  layerId: 5,
  title: "Chainage",
  elevationInfo: { mode: "relative-to-ground" },
  labelingInfo: [label_chainage],
  minScale: 150000,
  maxScale: 0,
  renderer: chainage_renderer,
  popupEnabled: false,
});

//--- PROW LAYER ---//
// ORIGINAL (DEFAULT)
export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/N2_Alignment/FeatureServer/1",
  layerId: 1,
  title: "PROW",
  popupEnabled: false,
  renderer: prow_renderer,
});

//--- STATION LAYER ---//
export const stationLayer = new FeatureLayer({
  portalItem: portalItems("876de8483da9485aac5df737cbef2143"),
  layerId: 2,
  title: "N2 Stations",
  labelingInfo: [label_stationp],
  elevationInfo: { mode: "relative-to-ground" },
});
stationLayer.listMode = "hide";

export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [chainageLayer, pierAccessLayer, prowLayer], //stationLayer,
});

//-----------------------------------------------//
//              Other Layers                     //
//-----------------------------------------------//
//--- DATES FEATURE TABLE ---//
export const dateTable = new FeatureLayer({
  portalItem: portalItems("b2a118b088a44fa0a7a84acbe0844cb2"),
});

//---------------------------------------------//
//              Media Layers                   //
//---------------------------------------------//
//--- DRONE VIDEO LAYER ---//
export const drone_video_point_layer = new FeatureLayer({
  portalItem: portalItems("6adfe17839d1465593ac3120749b3273"),
  layerId: 2,
  definitionExpression: "Query = 'depot' OR Query = 'station'",
  title: "Drone Video",
  outFields: ["*"],
  labelingInfo: [label_video],
  popupEnabled: false,
  elevationInfo: { mode: "relative-to-scene" },
});

//--- DRONE IMAGE LAYER ---//
export const drone_image_point_layer = new FeatureLayer({
  portalItem: portalItems("6adfe17839d1465593ac3120749b3273"),
  layerId: 1,
  elevationInfo: { mode: "relative-to-scene" },
  definitionExpression: "Query = 'depot' OR Query = 'station'",
  title: "Drone Image",
  outFields: ["*"],
  labelingInfo: [label_image],
  popupEnabled: false,
});

//--- COMPILE MEDIA LAYERS
export const droneLayers: any = {
  image: drone_image_point_layer,
  video: drone_video_point_layer,
};

export const droneImageVideoGroupLayer = new GroupLayer({
  title: "Drone Image & Video",
  visible: true,
  visibilityMode: "independent",
  layers: [drone_video_point_layer, drone_image_point_layer],
});

//---------------------------------------------//
//              Station Structures             //
//---------------------------------------------//
export const buildingLayer = new BuildingSceneLayer({
  portalItem: portalItems("a1f0981f5fac47c5b1d1e8ca80abc118"),
  outFields: ["Category", "Status", "BldgLevel", "StructureLevel", "Types"],
  title: "Station Structures",
  legendEnabled: false,
});

//--- ARCTIRECTURAL
export let columnsLayer: null | any;
export let floorsLayer: null | any;
export let wallsLayer: null | any;

//--- STRUCTURAL
export let stFramingLayer: null | any;
export let stColumnLayer: null | any;
export let stFoundationLayer: null | any;

//--- EXTERIOR SHELL
export let exteriorShellLayer: null | any;

//--- SUBLAYERS COLLECTION
export let sublayersAll: null | any = [];

buildingLayer.when(() => {
  buildingLayer.allSublayers.forEach((layer: any) => {
    switch (layer.modelName) {
      case "FullModel":
        layer.visible = true;
        break;

      case "Overview":
        exteriorShellLayer = layer;
        exteriorShellLayer.visible = false;
        exteriorShellLayer.title = "Exterior Shell";
        break;

      case "Columns":
        columnsLayer = layer;
        columnsLayer.popupTemplate = b_popup;
        columnsLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "Floors":
        floorsLayer = layer;
        floorsLayer.popupTemplate = b_popup;
        floorsLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "Walls":
        wallsLayer = layer;
        wallsLayer.popupTemplate = b_popup;
        wallsLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralFraming":
        stFramingLayer = layer;
        stFramingLayer.popupTemplate = b_popup;
        stFramingLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralColumns":
        stColumnLayer = layer;
        stColumnLayer.popupTemplate = b_popup;
        stColumnLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralFoundation":
        stFoundationLayer = layer;
        stFoundationLayer.popupTemplate = b_popup;
        stFoundationLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      default:
        layer.visible = true;
    }
  });
});
