import { getStoredFileSchema } from 'sanity-plugin-external-dam'
import config from '../config'
import schemaConfig from '../schema.config'

export default getStoredFileSchema(config, schemaConfig)
