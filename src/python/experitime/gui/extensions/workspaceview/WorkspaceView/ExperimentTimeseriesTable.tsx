import { Button } from '@material-ui/core'
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'
import Hyperlink from '../../../commonComponents/Hyperlink/Hyperlink'
import NiceTable from '../../../commonComponents/NiceTable/NiceTable'
import { ExperimentInfo } from './useExperimentInfo'

type Props = {
    experimentInfo: ExperimentInfo
    onClickTimeseries?: (timeseriesName: string) => void
    onViewTimeseriesMultiple?: (timeseriesNames: string[]) => void
}

const ExperimentTimeseriesTable: FunctionComponent<Props> = ({experimentInfo, onClickTimeseries, onViewTimeseriesMultiple}) => {
    const timeseriesNames = useMemo(() => {
        const ret = Object.keys(experimentInfo.timeseries).sort()
        ret.sort()
        return ret
    }, [experimentInfo.timeseries])
    const [selectedTimeseriesNames, setSelectedTimeseriesNames] = useState<string[]>([])

    const columns = useMemo(() => ([
        {
            key: 'timeseriesName',
            label: 'Timeseries'
        },
        {
            key: 'channelNames',
            label: 'Channels'
        },
        {
            key: 'numSamples',
            label: 'Num. samples'
        },
        {
            key: 'type',
            label: 'Type'
        }
    ]), [])

    const rows = useMemo(() => (
        timeseriesNames.map(timeseriesName => {
            const t = experimentInfo.timeseries[timeseriesName]
            return {
                key: timeseriesName,
                columnValues: {
                    timeseriesName: {
                        text: timeseriesName,
                        element: <Hyperlink onClick={onClickTimeseries && (() => {onClickTimeseries(timeseriesName)})}>{timeseriesName}</Hyperlink>
                    },
                    channelNames: t.channelNames.join(', '),
                    numSamples: t.numSamples,
                    type: t.type
                }
            }
        })
    ), [timeseriesNames, experimentInfo, onClickTimeseries])

    const handleViewSelected = useCallback(() => {
        onViewTimeseriesMultiple && onViewTimeseriesMultiple(selectedTimeseriesNames)
    }, [onViewTimeseriesMultiple, selectedTimeseriesNames])

    return (
        <div>
            {
                selectedTimeseriesNames.length > 0 && (
                    <Button onClick={handleViewSelected}>View selected</Button>
                )
            }
            <NiceTable
                columns={columns}
                rows={rows}
                selectedRowKeys={selectedTimeseriesNames}
                onSelectedRowKeysChanged={setSelectedTimeseriesNames}
                selectionMode="multiple"
            />
        </div>
    )
}

export default ExperimentTimeseriesTable