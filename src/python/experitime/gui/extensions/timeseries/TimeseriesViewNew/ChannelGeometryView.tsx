import React, { FunctionComponent, useMemo } from 'react';
import { TimeseriesSelection } from '../../../pluginInterface';
import { TimeseriesSelectionDispatch } from '../../../pluginInterface/TimeseriesSelection';
import ChannelGeometryWidget from '../../channelgeometry/ChannelGeometryWidget/ChannelGeometryWidget';
import { TimeseriesInfo } from '../../workspaceview/WorkspaceView/useExperimentInfo';


interface Props {
    timeseriesInfo: TimeseriesInfo
    width: number
    height: number
    selection?: TimeseriesSelection
    selectionDispatch?: TimeseriesSelectionDispatch
    visibleChannelNames: string[]
}

const ChannelGeometryView: FunctionComponent<Props> = ({timeseriesInfo, width, height, selection, visibleChannelNames, selectionDispatch}) => {
    const ri = timeseriesInfo
    const channels = useMemo(() => (ri ? zipChannels(ri.channelGeometry || ri.channelNames.map((name, i) => [i, 0]), ri.channelNames) : []).filter(a => (visibleChannelNames.includes(a.id))), [ri, visibleChannelNames])
    if (!ri) {
        return (
            <div>No recording info found for recording.</div>
        )
    }
    return (
        <ChannelGeometryWidget
            channels={channels}
            selection={selection}
            selectionDispatch={selectionDispatch}
            width={width}
            height={height}
        />
    );
}

const zipChannels = (locations: number[][], ids: string[]) => {
    if (locations && ids && ids.length !== locations.length) throw Error('Channel ID count does not match location count.')
    return ids.map((x, index) => {
        const loc = locations[index]
        return { label: x + '', id: x, x: loc[0], y: loc[1] }
    })
}

export default ChannelGeometryView