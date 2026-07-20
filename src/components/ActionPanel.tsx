import "@esri/calcite-components/components/calcite-panel";
import "@esri/calcite-components/components/calcite-list-item";
import "@esri/calcite-components/components/calcite-shell-panel";
import "@esri/calcite-components/components/calcite-action";
import "@esri/calcite-components/components/calcite-action-bar";
import "@arcgis/map-components/components/arcgis-building-explorer";
import { useEffect, useState } from "react";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-direct-line-measurement-3d";
import { defineActions } from "../uniqueValues";

function ActionPanel() {
  const shellPanel: any = document.getElementById("left-shell-panel");

  //--- Widget (Line Measurement)
  const directLineMeasure = document.querySelector(
    "arcgis-direct-line-measurement-3d",
  );

  //--- Define active & next widget states
  const [activeWidget, setActiveWidget] = useState(null);
  const [nextWidget, setNextWidget] = useState(null);

  //--- Click action handler function for active & next widget
  const handleActionClick = (event: any) => {
    const id = event.target.id;
    setNextWidget(id);
    setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
  };

  useEffect(() => {
    if (activeWidget) {
      const actionActiveWidget: any = document.querySelector(
        `[data-panel-id=${activeWidget}]`,
      );
      actionActiveWidget.hidden = true;
      shellPanel.collapsed = true;

      directLineMeasure && directLineMeasure.clear();
    }

    if (nextWidget !== activeWidget) {
      const actionNextWidget: any = document.querySelector(
        `[data-panel-id=${nextWidget}]`,
      );
      actionNextWidget.hidden = false;
      shellPanel.collapsed = false;
    }
  });

  return (
    <>
      <calcite-shell-panel
        slot="panel-start"
        id="left-shell-panel"
        displayMode="dock"
        collapsed
        style={{ "--calcite-shell-panel-background-color": "#2b2b2b" }}
      >
        <calcite-action-bar
          slot="action-bar"
          style={{
            borderStyle: "solid",
            borderRightWidth: 4,
            borderLeftWidth: 4,
            borderBottomWidth: 4.5,
            borderColor: "#555555",
          }}
        >
          <calcite-action
            data-action-id="layers"
            icon="layers"
            text="layers"
            id="layers"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="basemaps"
            icon="basemap"
            text="basemaps"
            id="basemaps"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="buildingexplorer"
            icon="organization"
            text="Building Explorer"
            id="buildingexplorer"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="directline-measure"
            icon="measure-line"
            text="Line Measurement"
            id="directline-measure"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="information"
            icon="information"
            text="Information"
            id="information"
            onClick={handleActionClick}
          ></calcite-action>
        </calcite-action-bar>

        <calcite-panel heading="Layers" data-panel-id="layers" hidden>
          <arcgis-layer-list
            referenceElement="arcgis-scene"
            selectionMode="multiple"
            visibilityAppearance="checkbox"
            filter-placeholder="Filter layers"
            listItemCreatedFunction={defineActions}
          ></arcgis-layer-list>
        </calcite-panel>

        <calcite-panel heading="Basemaps" data-panel-id="basemaps" hidden>
          <arcgis-basemap-gallery referenceElement="arcgis-scene"></arcgis-basemap-gallery>
        </calcite-panel>

        <calcite-panel
          heading="Building Explorer"
          data-panel-id="buildingexplorer"
          hidden
        >
          <arcgis-building-explorer referenceElement="arcgis-scene"></arcgis-building-explorer>
        </calcite-panel>

        <calcite-panel
          heading="Direct Line Measure"
          data-panel-id="directline-measure"
          hidden
        >
          <arcgis-direct-line-measurement-3d
            id="directLineMeasurementAnalysisButton"
            referenceElement="arcgis-scene"
          ></arcgis-direct-line-measurement-3d>
        </calcite-panel>

        <calcite-panel heading="Description" data-panel-id="information" hidden>
          {nextWidget === "information" && (
            <div style={{ paddingLeft: "20px" }}>
              This smart map shows the construction progress on structural
              components of station buildings:
              <ul>
                <li>Structural Foundation, </li>
                <li>Structural Column, </li>
                <li>Structural Framing, </li>
                <li>Roofs, </li>
                <li>Walls, </li>
                <li>Others </li>
              </ul>
              <div style={{ paddingLeft: "20px" }}>
                <li>
                  The source of data: <b>BIM models.</b>
                </li>
                <li>
                  {" "}
                  The construction progress is manually updated based on the
                  information provided by the N2 Civil Team.
                </li>
              </div>
            </div>
          )}
        </calcite-panel>
      </calcite-shell-panel>
    </>
  );
}

export default ActionPanel;
