import { use } from "react";
import "../index.css";
import "@esri/calcite-components/components/calcite-segmented-control";
import "@esri/calcite-components/components/calcite-segmented-control-item";
import { MyContext } from "../contexts/MyContext";
import { station_names_q } from "../uniqueValues";

export default function StationSegmentedList() {
  const { updateStations, stations } = use(MyContext);

  return (
    <>
      <calcite-segmented-control
        oncalciteSegmentedControlChange={(event: any) => {
          updateStations(event.target.selectedItem.id);
        }}
        scale="m"
        width="full"
      >
        {stations &&
          station_names_q.map((f: any, index: any) => {
            return (
              <calcite-segmented-control-item
                {...(stations === f.name ? { checked: true } : {})}
                key={index}
                value={f.name}
                id={f.name}
              >
                {f.name}
              </calcite-segmented-control-item>
            );
          })}
      </calcite-segmented-control>
    </>
  );
}
