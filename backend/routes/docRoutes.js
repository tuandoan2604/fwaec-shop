import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from '../docs/swaggerDef.js';
import productRoutes from "./productRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import orderRoutes from "./orderRoutes.js";
import userRoutes from "./userRoutes.js";
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/routes/*.js'],
});

router.use('/', swaggerUi.serve);
router.route(
  '/').get(
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

const defaultRoutes = [
    {
        path: '/api/products',
        route: productRoutes,
    },
    {
        path: '/api/users',
        route: userRoutes,
    },
    {
        path: '/api/uploads',
        route: uploadRoutes,
    },
    {
        path: '/api/orders',
        route: orderRoutes,
    },
];

const devRoutes = [
    // routes available only in development mode
    {
        path: '/api/docs',
        route: router,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}

export default router
