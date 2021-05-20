import { useTask } from "../../../labbox"

export type TimeseriesInfo = {
    uri: string
    object: any
    channelNames: string[]
    numSamples: number
    startTime: number
    endTime: number
    type: 'continuous' | 'discrete'
    samplingFrequency: number
    noiseLevel?: number
    channelGeometry?: number[][]
}

export type ExperimentInfo = {
    timeseries: {[key: string]: TimeseriesInfo}
}

const useExperimentInfo = (experimentUri: string | undefined) => {
    const {returnValue: experimentInfo, task} = useTask<ExperimentInfo>(experimentUri ? 'get_experiment_info.11' : '', {experiment_uri: experimentUri})
    return {experimentInfo, task}
}

export default useExperimentInfo