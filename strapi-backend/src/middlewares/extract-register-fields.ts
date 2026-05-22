export default () => {
  return async (ctx: any, next: any) => {
    if (
      ctx.request.method === 'POST' &&
      ctx.request.path === '/api/auth/local/register' &&
      ctx.request.body
    ) {
      const { name, surname, ...rest } = ctx.request.body;

      // Rimuovi i campi extra prima che Strapi li validi
      ctx.request.body = rest;

      // Esegui il resto della pipeline (registrazione)
      await next();

      // Dopo la registrazione, se è andata a buon fine, salva name e surname
      if (ctx.status === 200 && (name || surname)) {
        const userId = ctx.body?.user?.id;
        if (userId) {
          await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: userId },
            data: { name, surname },
          });
          if (ctx.body?.user) {
            ctx.body.user.name = name;
            ctx.body.user.surname = surname;
          }
        }
      }
    } else {
      await next();
    }
  };
};
