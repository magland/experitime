import React, { FunctionComponent, useMemo } from 'react';
import TimeseriesWidgetNew from './TimeseriesWidgetNew';
import useTimeseriesData from './useTimeseriesModel';
import { TimeseriesInfo } from '../../workspaceview/WorkspaceView/useExperimentInfo'
import { TimeseriesSelectionDispatch, TimeseriesSelection } from '../../../pluginInterface/TimeseriesSelection';
import Splitter from '../../../commonComponents/Splitter/Splitter';
import ChannelGeometryView from './ChannelGeometryView';

interface Props {
    timeseriesInfo: TimeseriesInfo
    width: number
    height: number
    opts: {
        channelSelectPanel?: boolean
    }
    timeseriesSelection?: TimeseriesSelection
    timeseriesSelectionDispatch?: TimeseriesSelectionDispatch
}

// interface TimeseriesInfo {
//     samplerate: number
//     segment_size: number
//     num_channels: number
//     channel_ids: number[]
//     channel_locations: (number[])[]
//     num_timepoints: number
//     y_offsets: number[]
//     y_scale_factor: number
//     initial_y_scale_factor: number
// }

const TimeseriesViewNew: FunctionComponent<Props> = ({timeseriesInfo, opts, timeseriesSelection, timeseriesSelectionDispatch, width, height}) => {
    const selectedChannelNames = useMemo(() => (timeseriesSelection?.selectedChannelNames || []), [timeseriesSelection?.selectedChannelNames])
    const visibleChannelNames = useMemo(() => (timeseriesSelection?.visibleChannelNames || timeseriesInfo.channelNames), [timeseriesSelection?.visibleChannelNames, timeseriesInfo.channelNames])

    const y_scale_factor = 1 / (timeseriesInfo.noiseLevel || 1) * 1/10

    const timeseriesData = useTimeseriesData(timeseriesInfo)

    if (timeseriesData) {
        return (
            <div>
                <Splitter
                    width={width}
                    height={height}
                    initialPosition={200}
                >
                    {
                        opts.channelSelectPanel && (
                            <ChannelGeometryView
                                timeseriesInfo={timeseriesInfo}
                                width={0} // filled in above
                                height={0} // filled in above
                                visibleChannelNames={visibleChannelNames}
                                selection={timeseriesSelection}
                                selectionDispatch={timeseriesSelectionDispatch}
                            />
                        )
                    }
                    {
                        ((!opts.channelSelectPanel) || (selectedChannelNames.length > 0) || (visibleChannelNames.length <= 12)) ? (
                            <TimeseriesWidgetNew
                                timeseriesData={timeseriesData}
                                channel_names={timeseriesInfo.channelNames}
                                // y_offsets={timeseriesInfo.y_offsets}
                                // y_scale_factor={timeseriesInfo.y_scale_factor * (timeseriesInfo.initial_y_scale_factor || 1)}
                                y_scale_factor={y_scale_factor}
                                width={width} // filled in above
                                height={height} // filled in above
                                visibleChannelNames={opts.channelSelectPanel ? (selectedChannelNames.length > 0 ? selectedChannelNames : visibleChannelNames) : null}
                                timeseriesSelection={timeseriesSelection}
                                timeseriesSelectionDispatch={timeseriesSelectionDispatch}
                            />
                        ) : (
                            <div>Select one or more electrodes</div>
                        )
                    }
                </Splitter>
            </div>
        )
    }
    else {
        return (
            <div>Creating timeseries model</div>
        )
    }
}

// const calculateTimeseriesInfo = async (recordingObject: RecordingObject, hither: HitherInterface): Promise<TimeseriesInfo> => {
//     let info: TimeseriesInfo
//     try {
//         info = await hither.createHitherJob(
//             'createjob_calculate_timeseries_info',
//             { recording_object: recordingObject },
//             {
//                 useClientCache: true
//             }
//         ).wait() as TimeseriesInfo
//     }
//     catch (err) {
//         console.error(err);
//         throw Error('Problem calculating timeseries info.')
//     }
//     if (!info) {
//         throw Error('Unexpected problem calculating timeseries info: info is null.')
//     }
//     return info
// }

export default TimeseriesViewNew