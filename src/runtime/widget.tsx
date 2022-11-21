
/** @jsx jsx */

import { AllWidgetProps, jsx, FeatureLayerDataSource, WidgetProps, DataSourceComponent, FeatureLayerQueryParams, DataSource, DataSourceStatus, DataRecordsSelectionChangeMessage, MessageManager, IMDataSourceInfo } from "jimu-core";
import { styled } from "jimu-theme";
import { Button, WidgetPlaceholder } from "jimu-ui";
import { useState } from "react";

const alertIcon = require("./assets/alert.svg");
import defaultMessages from "./translations/default";

const Gallery = styled.div`
height: 100%;
`;

export default function (props: AllWidgetProps<WidgetProps>) {

  const dsConfigured = props.useDataSources && props.useDataSources.length > 0;
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const handleDsInfoChange = (evt: IMDataSourceInfo) => {
    console.log("Data source info changed", evt.selectedIds && evt.selectedIds.length > 0 ? evt.selectedIds[0] : "no selection");
    if (evt.selectedIds && evt.selectedIds.length > 0) {
      setSelectedRecordId(evt.selectedIds[0]);
    }
  }

  const dataRender = (ds: DataSource) => {
    return (
      ds && ds.getStatus() === DataSourceStatus.Loaded ? <Gallery>
        {ds.getRecords().map((r, i) => {
          const recordId = r.getId();
          return (
            <Button type={selectedRecordId && selectedRecordId === recordId ? "secondary" : "tertiary"} key={i}
              onClick={() => {
                ds.selectRecordById(recordId);
                setSelectedRecordId(recordId);
                MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(props.id, [r]))
                console.log("Record selected in the list", r);
              }}>{recordId}
            </Button>
          )
        })}
      </Gallery> : <div>Loading...</div>
    )
  }

  return (
    <div className="widget-get-map-coordinates jimu-widget p-2">
      {dsConfigured ?
        (<DataSourceComponent
          useDataSource={props.useDataSources[0]}
          query={{ where: '1=1' } as FeatureLayerQueryParams}
          onDataSourceInfoChange={handleDsInfoChange}
          widgetId={props.id}
        >
          {dataRender}
        </DataSourceComponent>)
        :
        (<WidgetPlaceholder icon={alertIcon} message={defaultMessages.chooseSource}>
        </WidgetPlaceholder>)}
    </div>
  )
}