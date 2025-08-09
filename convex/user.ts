import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    subscription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    if (user?.length == 0) {
      const userData = {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        // subscription:args.subscription
      };
      const result = await ctx.db.insert("UserTable", userData);
      return result;
    }
    return user[0];
  },
});
