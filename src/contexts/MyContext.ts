import { createContext } from "react";

type MyDropdownContextType = {
  stations: any;
  imageopen: any;
  mediatype: any;
  mediasrcpaths: any;
  mediaSelectedscale: any;
  mediatimestamp: any;
  chartPanelwidth: any;
  updateStations: any;
  updateImageOpen: any;
  updateMediatype: any;
  updateMediasrcpaths: any;
  updateMediaSelectedscale: any;
  updateMediatimestamp: any;
  updateChartPanelwidth: any;
};

const initialState = {
  stations: undefined,
  imageopen: undefined,
  mediatype: undefined,
  mediasrcpaths: undefined,
  mediaSelectedscale: undefined,
  mediatimestamp: undefined,
  chartPanelwidth: undefined,
  updateStations: undefined,
  updateImageOpen: undefined,
  updateMediatype: undefined,
  updateMediasrcpaths: undefined,
  updateMediaSelectedscale: undefined,
  updateMediatimestamp: undefined,
  updateChartPanelwidth: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
