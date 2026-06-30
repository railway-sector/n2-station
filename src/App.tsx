import { useState, useEffect } from "react";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/components/calcite-shell";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import MainChart from "./components/MainChart";
import UndergroundSwitch from "./components/UndergroundSwitch";
import { MyContext } from "./contexts/MyContext";
import { image_scales, station_names } from "./uniqueValues";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authenticate } from "./autho";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "rfqb7nXRkDPAWODT");
  }, []);

  const [stations, setStations] = useState<any>(station_names[0]);
  const [imageopen, setImageOpen] = useState<boolean>(false);
  const [mediatype, setMediatype] = useState<string>();
  const [mediasrcpaths, setMediasrcpaths] = useState<string>();
  const [mediaSelectedscale, setMediaSelectedscale] = useState<any>(
    image_scales[0],
  );
  const [mediatimestamp, setMediatimestamp] = useState<any>();

  const updateStations = (newStation: any) => {
    setStations(newStation);
  };

  const updateImageOpen = (newImageOpen: any) => {
    setImageOpen(newImageOpen);
  };

  const updateMediatype = (newMedia: any) => {
    setMediatype(newMedia);
  };

  const updateMediasrcpaths = (newSrc: any) => {
    setMediasrcpaths(newSrc);
  };

  const updateMediaSelectedscale = (newScale: any) => {
    setMediaSelectedscale(newScale);
  };

  const updateMediatimestamp = (NewTime: any) => {
    setMediatimestamp(NewTime);
  };

  return (
    <>
      {loggedInState === true ? (
        <div>
          <calcite-shell
            style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #555" }}
          >
            <MyContext
              value={{
                stations,
                imageopen,
                mediatype,
                mediasrcpaths,
                mediaSelectedscale,
                mediatimestamp,
                updateStations,
                updateImageOpen,
                updateMediatype,
                updateMediasrcpaths,
                updateMediaSelectedscale,
                updateMediatimestamp,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <ActionPanel />
                <UndergroundSwitch />
                <MapDisplay />
                <MainChart />
                <Header />
              </QueryClientProvider>
            </MyContext>
          </calcite-shell>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default App;
