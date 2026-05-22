export default {
  register() {},
  async bootstrap({ strapi }: { strapi: any }) {
    console.log("EMAIL CONFIG:", strapi.config.get("plugin::email"));
  },
};