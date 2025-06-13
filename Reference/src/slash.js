import {
  slashPlugin,
  slash,
  createDropdownItem,
  defaultActions
} from "@milkdown/plugin-slash";

export default slash.configure(slashPlugin, {
  config: (ctx) => {
    // Get default slash plugin items
    const actions = defaultActions(ctx);

    // Define a status builder
    return ({ isTopLevel, content, parentNode }) => {
      // You can only show something at root level
      if (!isTopLevel) return null;

      // Empty content ? Set your custom empty placeholder !
      if (!content) {
        return { placeholder: "Type / to use the slash commands..." };
      }

      // Define the placeholder & actions (dropdown items) you want to display depending on content
      if (content.startsWith("/")) {
        // Add some actions depending on your content's parent node
        if (parentNode.type.name === "customNode") {
          actions.push({
            id: "custom",
            dom: createDropdownItem(ctx.get(themeManagerCtx), "Custom", "h1"),
            command: () =>
              ctx.get(commandsCtx).call(/* Add custom command here */),
            keyword: ["custom"],
            typeName: "heading"
          });
        }

        return content === "/"
          ? {
              placeholder: "Type to filter...",
              actions
            }
          : {
              actions: actions.filter(({ keyword }) =>
                keyword.some((key) =>
                  key.includes(content.slice(1).toLocaleLowerCase())
                )
              )
            };
      }
    };
  }
});
