const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const Routes = require('./Routes/Routes');
const Mongoose = require("mongoose");
const Joi = require("joi");

(async () => {
    const server = await new Hapi.Server({
        host: 'localhost',
        port: 3000,
    });
    

    const swaggerOptions = {
        info: {
                title: 'Test API Documentation',
                version: Pack.version,
            },
        };

    const db = Mongoose.connect('mongodb://localhost/organizationdb');

    const schema = new Mongoose.Schema({
        name: String,
        description: String,
        url: String,
        code: { type: String, required: true, unique: true},
        type: String
      });

    const OrganizationModel = Mongoose.model("organization", schema);

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch(err) {
        console.log(err);
    }

    server.route({
        method: "GET",
        path: "/organization",
        options :{
        handler: async (request, h) => {
          try {
            //const namev='', codev='';
            const namev =request.query.name;
            const codev =request.query.code;
            let a= [];
            
            if(namev){
                const query = OrganizationModel.find({name : 'David Company M 1213123 borrar '});
                query.exec(function (err, docs) {
                a.push(docs);
                console.log(a);
                });
            }else {
                if(codev){
                const query = OrganizationModel.find({code : codev });
                query.exec(function (err, docs) {
                    a.push(docs);
                });
                }else {
                    const org = await OrganizationModel.find().exec();
            const filter = org.map( item => {
              const b =[];
              b.push(item.name);
              b.push(item.description);
              b.push(item.type);
              a.push(b);
            });
                }
            };

            return h.response(a);
            
        } catch (error) {
            return h.response(error).code(500);
        }
        },
        tags:['api']
      }
    },
    );

    server.route(
        {
            method: 'POST',
            path: '/organization',
            options :{
                handler: async (request, h) => {
                    try {
                        const org = new OrganizationModel(JSON.parse(request.payload));
                        console.log(org);
                        const result = await org.save();
                        return result;
                      } catch (error) {
                        var error = error;
                      console.log(error);
                        return h.response(error).code(500);
                      }
                },
                tags:['api']
              }
        }
            
    );

    server.route(
        {
            method: "PUT",
        path: "/organization/{id}",
        options: {
          /* validate: {
              payload: {
                  name: Joi.string().optional(),
                  description: Joi.string().optional(),
                  url: Joi.string().optional(),
                  code: Joi.string().optional(),
                  type: Joi.string().optional()
              },
              failAction: (request, h, error) => {
                  return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover();
              }
          } */
          handler: async (request, h) => {
            try {
              const result = await OrganizationModel.findByIdAndUpdate(request.params.id, request.payload, { new: true });
              return h.response(result);
            } catch (error) {
              return h.response(error).code(500);
            }
          },
          tags:['api']
      }
        }
    );


    server.route(
      {
        method: "DELETE",
        path: '/organization/{id*}',
        options: {
            tags:['api'],
            handler: async (request, h) => {
                try {
                  const result = await OrganizationModel.findByIdAndDelete(request.params.id);
              return h.response(result);
              } catch (error) {
                  return h.response(error).code(500);
              }
              }
        }
      }
    );

})();