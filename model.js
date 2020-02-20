const OrganizationModel = Mongoose.model("organization", {
    name: String,
    description: String,
    url: String,
    code: { type: String, required: true },
    type: String
  });

  module.exports = OrganizationModel;