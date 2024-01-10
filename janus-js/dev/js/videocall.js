import { JanusJs, JanusVideoCallPlugin } from '@januscaler/janus-js'
import { config } from './conf'
const janus = new JanusJs({
    ...config.servercheap,
    // token: 'boom',
})
await janus.init({ debug: true })
const session = await janus.createSession()
const videoCallPlugin = await session.attach(JanusVideoCallPlugin)
await videoCallPlugin.register('boomer')