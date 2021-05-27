import { useTask } from "../../../labbox"

export interface ChannelPropertiesInterface {
    location: number[]
}

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
    channelProperties?: {[key: string]: ChannelPropertiesInterface}
}

export type ExperimentInfo = {
    timeseries: {[key: string]: TimeseriesInfo}
}

const useExperimentInfo = (experimentUri: string | undefined) => {
    const {returnValue: experimentInfo, task} = useTask<ExperimentInfo>(experimentUri ? 'get_experiment_info.13' : '', {experiment_uri: experimentUri})
    return {experimentInfo, task}
}

export default useExperimentInfo