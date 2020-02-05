

const Hapi = require("@hapi/hapi");
const Mongoose = require("mongoose");
const Joi = require("joi");
const swaggered = require('hapi-swaggered');
const swaggeredUI = require('hapi-swaggered-ui');
const Vision = require('@hapi/inert');
const Inert = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

(async () => {
const server = new Hapi.Server({ "host": "localhost", "port": 3000 });

const swaggerOptions = {
  info: {
    title: 'Organization API Documentation',
    version: '0.0.1'
  }
}

const db = Mongoose.connect('mongodb://localhost/organizationdb');

const OrganizationModel = Mongoose.model("organization", {
  name: String,
  description: String,
  url: String,
  code: { type: String, required: true },
  type: String
});

server.route({
  method: "GET",
  path: "/organization",
  handler: async (request, h) => {
    try {
      const org = await OrganizationModel.find().exec();
      const a= [];
      const filter = org.map( item => {
        const b =[];
        b.push(item.name);
        b.push(item.description);
        b.push(item.type);
        a.push(b);
      });
      return h.response(a);
      
  } catch (error) {
      return h.response(error).code(500);
  }
  }
});

server.route({
  method: "GET",
  path: "/organization/code/{id}",
  handler: async (request, h) => {
    try {
      var org = await OrganizationModel.find({code:request.params.id}).exec();
      
      return h.response(org);
  } catch (error) {
      return h.response(error).code(500);
  }
  }
});

server.route({
  method: "GET",
  path: "/organization/name/{id}",
  handler: async (request, h) => {
    try {
      var org = await OrganizationModel.find({name:request.params.id}).exec();
      
      return h.response(org);
  } catch (error) {
      return h.response(error).code(500);
  }
  }
});

server.route({
    method: "POST",
    path: "/organization",
    options: {
        validate: {}
    },
    handler: async (request, h) => {
      try {
        const org = new OrganizationModel(request.payload);
        console.log(org);
        const result = await org.save();
        return result;
      } catch (error) {
        var error = error;
      console.log(error);
        return h.response(error).code(500);
      }
    }
});


server.route({
    method: "GET",
    path: "/organization/{id}",
    handler: async (request, h) => {
      try {
        const org = await OrganizationModel.findById(request.params.id).exec();
        return h.response(org);
      } catch (error) {
        return h.response(error).code(500);
      }
    }
});

server.route({
    method: "PUT",
    path: "/organization/{id}",
    options: {
        validate: {}
    },
    options: {
      validate: {
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
      }
  },
    handler: async (request, h) => {
      try {
        const result = await OrganizationModel.findByIdAndUpdate(request.params.id, request.payload, { new: true });
        return h.response(result);
      } catch (error) {
        return h.response(error).code(500);
      }
    }
});

server.route({
    method: "DELETE",
    path: "/person/{id}",
    handler: async (request, h) => {
      try {
        var result = await OrganizationModel.findByIdAndDelete(request.params.id);
        return h.response(result);
    } catch (error) {
        return h.response(error).code(500);
    }
    }
});

await server.register([
  Inert,
  Vision,
  {
    plugin: HapiSwagger,
    options: swaggerOptions
  }
]);

server.start();

})();