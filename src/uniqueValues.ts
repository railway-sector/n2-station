export const type_field = "Type";
export const status_field = "Status";
export const category_field = "Category";
export const stationName_field = "Station";

//--- type definitions
export type StatusTypenamesType =
  | "To be Constructed"
  | "Under Construction"
  | "delayed"
  | "Completed";
export type StatusStateType = "comp" | "incomp" | "ongoing" | "delayed";
export type LayerNameType = "utility" | "viaduct" | "others";
export type TypeFieldType = "number" | "string";

export const statusLabels = ["incomp", "ongoing", "delayed", "comp"];
export const statusValues = [1, 2, 3, 4];
export const statusArray = statusLabels.map((status: any, index: any) => {
  return Object.assign({
    status: status,
    value: statusValues[index],
  });
});

// Media parameters
export const image_scales = [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4];
export const img_size = 280;
export const timestamp_field = "timestamp";

// month
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//--- Station names

export const station_names = [
  "Calumpit",
  "Apalit",
  "San Fernando",
  "Angeles",
  "Clark",
  "CIA",
];
export const stationValues = [8, 7, 6, 5, 4, 3];
export const stationNamesArray = station_names.map((name: any, index: any) => {
  return Object.assign({
    name: name,
    value: stationValues[index],
  });
});

//--- Station Structure types
export const structure_type_labels = [
  "St.Foundation",
  "St.Column",
  "St.Framing",
  "Floors",
  "Walls",
  "Columns",
];

//-- model names
export const sublayerModelNames = [
  "StructuralFoundation",
  "StructuralColumns",
  "StructuralFraming",
  "Floors",
  "Walls",
  "Columns",
];

export const structure_type_values = [1, 2, 3, 5, 6, 7];
export const structureTypes = structure_type_labels.map(
  (label: any, index: any) => {
    return Object.assign({
      category: label,
      value: structure_type_values[index],
      modelName: sublayerModelNames[index],
    });
  },
);

//--- chart parameters
export const chart_colors = ["#000000", "#f7f7f7ff", "#FF0000", "#0070ff"];
