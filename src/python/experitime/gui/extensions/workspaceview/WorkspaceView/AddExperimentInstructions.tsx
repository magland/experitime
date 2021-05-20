import React from 'react'
import { FunctionComponent } from "react"
import useRoute from '../../../route/useRoute'
import Markdown from '../../../commonComponents/Markdown/Markdown'
import addExperimentMd from './addExperiment.md.gen'

type Props = {
}

const AddExperimentInstructions: FunctionComponent<Props> = () => {
    const {workspaceUri} = useRoute()
    return (
        <Markdown
            source={addExperimentMd}
            substitute={{
                workspaceUri
            }}
        />
    )
}

export default AddExperimentInstructions