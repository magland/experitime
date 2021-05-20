// LABBOX-EXTENSION: channelgeometry
// LABBOX-EXTENSION-TAGS: jupyter

import { LabboxExtensionContext } from "../../pluginInterface";

// const zipChannels = (locations: number[][], ids: string[]) => {
//     if (locations && ids && ids.length !== locations.length) throw Error('Channel ID count does not match location count.')
//     return ids.map((x, index) => {
//         const loc = locations[index]
//         return { label: x + '', id: x, x: loc[0], y: loc[1] }
//     })
// }

// const ChannelGeometryRecordingView: FunctionComponent<TimeseriesViewOptions> = ({timeseriesUri, width, height, selection, selectionDispatch}) => {
//     const ri = useTimeriesInfo(recording.recordingObje)
//     const visibleChannelNames = selection.visibleChannelNames
//     const channels = useMemo(() => (ri ? zipChannels(ri.geom, ri.channel_ids) : []).filter(a => ((!visibleChannelNames) || (visibleChannelNames.includes(a.id)))), [ri, visibleChannelNames])

//     // const handleSelectedChannelNamesChanged = useCallback((x: number[]) => {
//     //     selectionDispatch({type: 'SetSelectedChannelNames', selectedChannelNames: x})
//     // }, [selectionDispatch])

//     // const selectedChannelNames = useMemo(() => (selection.selectedChannelNames || []), [selection.selectedChannelNames])

//     // const [selectedChannelNames, setSelectedChannelNames] = useState<number[]>([]);
//     if (!ri) {
//         return (
//             <div>No recording info found for recording.</div>
//         )
//     }
//     return (
//         <ChannelGeometryWidget
//             channels={channels}
//             selection={selection}
//             selectionDispatch={selectionDispatch}
//             width={width || 350}
//             height={height || 150}
//         />
//     );
// }

// const ChannelGeometrySortingView: FunctionComponent<SortingViewProps> = ({recording, recordingInfo, calculationPool, width, height, selection, selectionDispatch}) => {
//     return (
//         <ChannelGeometryRecordingView
//             {...{recording, recordingInfo, calculationPool, width, height, selection, selectionDispatch}}
//         />
//     )
// }

export function activate(context: LabboxExtensionContext) {
    // context.registerPlugin({
    //     type: 'RecordingView',
    //     name: 'ChannelGeometryRecordingView',
    //     label: 'Channel geometry',
    //     priority: 50,
    //     defaultExpanded: false,
    //     component: ChannelGeometryRecordingView,
    //     singleton: true,
    //     icon: <GrainIcon />
    // })
    // context.registerPlugin({
    //     type: 'SortingView',
    //     name: 'ChannelGeometrySortingView',
    //     label: 'Channel geometry',
    //     priority: 50,
    //     component: ChannelGeometrySortingView,
    //     singleton: true,
    //     icon: <GrainIcon />
    // })
}