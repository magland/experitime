// LABBOX-EXTENSION: timeseries
// LABBOX-EXTENSION-TAGS: jupyter

import { LabboxExtensionContext } from "../../pluginInterface";

// const TimeseriesSortingView: FunctionComponent<SortingViewProps> = ({recording, recordingInfo, width, height, selection, selectionDispatch}) => {
//     return (
//         <TimeseriesViewNew
//             recordingObject={recording.recordingObject}
//             recordingInfo={recordingInfo}
//             width={width || 600}
//             height={height || 600}
//             opts={{channelSelectPanel: true}}
//             recordingSelection={selection}
//             recordingSelectionDispatch={selectionDispatch}
//         />
//     )
// }

// const TimeseriesRecordingView: FunctionComponent<RecordingViewProps> = ({recording, recordingInfo, width, height, selection, selectionDispatch}) => {
//     return (
//         <TimeseriesViewNew
//             recordingObject={recording.recordingObject}
//             recordingInfo={recordingInfo}
//             width={width || 600}
//             height={height || 600}
//             opts={{channelSelectPanel: true}}
//             recordingSelection={selection}
//             recordingSelectionDispatch={selectionDispatch}
//         />
//     )
// }

export function activate(context: LabboxExtensionContext) {
    // context.registerPlugin({
    //     type: 'RecordingView',
    //     name: 'TimeseriesView',
    //     label: 'Timeseries',
    //     priority: 50,
    //     fullWidth: true,
    //     component: TimeseriesRecordingView
    // })
    // context.registerPlugin({
    //     type: 'SortingView',
    //     name: 'TimeseriesView',
    //     label: 'Timeseries',
    //     priority: 50,
    //     component: TimeseriesSortingView,
    //     icon: <TimelineIcon />
    // })
}