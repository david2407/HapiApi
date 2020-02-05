module.exports = [
  { 
    method: "GET",
    path: "/organization",
    options :{
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
    },
    tags:['api']
  }
  },
  { 
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
},
{
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
}
];