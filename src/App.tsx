import { useState, useEffect, useCallback } from "react";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/components/calcite-shell";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import UndergroundSwitch from "./components/UndergroundSwitch";
import { MyContext } from "./contexts/MyContext";
import { image_scales } from "./uniqueValues";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authenticate } from "./autho";
import Chart from "./components/Chart";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "rfqb7nXRkDPAWODT");
  }, []);

  const [stations, setStations] = useState<any>("Calumpit");
  const [mediaopen, setMediaopen] = useState<boolean>(false);
  const [mediatype, setMediatype] = useState<string>();
  const [mediapaths, setMediapaths] = useState<string>();
  const [mediascale, setMediascale] = useState<any>(image_scales[0]);
  const [mediatimestamp, setMediatimestamp] = useState<any>();

  const updateStations = useCallback((newStation: any) => {
    setStations(newStation);
  }, []);

  const updateMediaopen = useCallback((newImageOpen: any) => {
    setMediaopen(newImageOpen);
  }, []);

  const updateMediatype = useCallback((newMedia: any) => {
    setMediatype(newMedia);
  }, []);

  const updateMediapaths = useCallback((newSrc: any) => {
    setMediapaths(newSrc);
  }, []);

  const updateMediascale = useCallback((newScale: any) => {
    setMediascale(newScale);
  }, []);

  const updateMediatimestamp = useCallback((NewTime: any) => {
    setMediatimestamp(NewTime);
  }, []);

  return (
    <>
      {loggedInState === true && (
        <div>
          <calcite-shell
            style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #555" }}
          >
            <MyContext
              value={{
                stations,
                mediaopen,
                mediatype,
                mediapaths,
                mediascale,
                mediatimestamp,
                updateStations,
                updateMediaopen,
                updateMediatype,
                updateMediapaths,
                updateMediascale,
                updateMediatimestamp,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <ActionPanel />
                <UndergroundSwitch />
                <MapDisplay />
                <Chart />
                <Header />
              </QueryClientProvider>
            </MyContext>
          </calcite-shell>
        </div>
      )}
    </>
  );
}

export default App;
