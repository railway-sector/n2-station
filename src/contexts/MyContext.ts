import { createContext } from "react";

type MyDropdownContextType = {
  stations: any;
  mediaopen: any;
  mediatype: any;
  mediapaths: any;
  mediascale: any;
  mediatimestamp: any;
  updateStations: any;
  updateMediaopen: any;
  updateMediatype: any;
  updateMediapaths: any;
  updateMediascale: any;
  updateMediatimestamp: any;
};

const initialState = {
  stations: undefined,
  mediaopen: undefined,
  mediatype: undefined,
  mediapaths: undefined,
  mediascale: undefined,
  mediatimestamp: undefined,
  updateStations: undefined,
  updateMediaopen: undefined,
  updateMediatype: undefined,
  updateMediapaths: undefined,
  updateMediascale: undefined,
  updateMediatimestamp: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
