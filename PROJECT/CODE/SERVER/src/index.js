// -- IMPORTS

import dotenv from 'dotenv';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fs from 'fs';
import path from 'path';
import { HomePageController } from './lib/controller/home_page_controller';
import { PropertiesPageController } from './lib/controller/properties_page_controller';
import { PropertyPageController } from './lib/controller/property_page_controller';
import { supabaseService } from './lib/service/supabase_service';

// -- STATEMENTS

dotenv.config();

let fastify = Fastify( { logger: true } );

fastify.register(
    fastifyCors,
    {
        origin: '*'
    }
    );

fastify.register(
    fastifyStatic,
    {
        root : path.join( __dirname, 'public' ),
        prefix : '/'
    }
    );

let homePageController = new HomePageController();
let propertiesPageController = new PropertiesPageController();
let propertyPageController = new PropertyPageController();

fastify.post(
    '/page/home',
    async ( request, reply ) =>
    {
        return await homePageController.processRequest( request, reply );
    }
    );

fastify.post(
    '/page/properties',
    async ( request, reply ) =>
    {
        return await propertiesPageController.processRequest( request, reply );
    }
    );

fastify.post(
    '/page/property/:id',
    async ( request, reply ) =>
    {
        return await propertyPageController.processRequest( request, reply );
    }
    );

fastify.setNotFoundHandler(
    async ( request, reply ) =>
    {
        let htmlFilePath = path.join( __dirname, 'public', 'index.html' );
        let htmlFileContent = fs.readFileSync( htmlFilePath, 'utf8' );
        reply.type( 'text/html' ).send( htmlFileContent );
    }
    );

let start =
    async () =>
    {
        console.log( await supabaseService.getClient() );

        try
        {
            await fastify.listen( { port : 8000, host : '0.0.0.0' } );
        }
        catch ( error )
        {
            fastify.log.error( error );

            process.exit( 1 );
        }
    };

fastify.ready(
    async err =>
    {
        if ( err )
        {
            throw err;
        }
        else
        {
            start();
        }
    }
    );
