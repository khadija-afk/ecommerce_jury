
import AdminJSExpress from '@adminjs/express'

import {adminJs} from '../models/index.js'



// Configurer un routeur pour AdminJS
const routerAdmin = AdminJSExpress.buildRouter(adminJs);

export default routerAdmin;